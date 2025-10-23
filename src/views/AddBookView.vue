<template>
  <section class="wrap">
    <!-- Add -->
    <div class="card">
      <h1 class="title">Add Book</h1>
      <form class="form" @submit.prevent="addBook">
        <div class="field">
          <label for="isbn">ISBN</label>
          <input id="isbn" v-model="isbn" type="text" />
        </div>
        <div class="field">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" placeholder="Book title" />
        </div>
        <button class="btn" type="submit" :disabled="adding">
          {{ adding ? 'Adding...' : 'Add Book' }}
        </button>
      </form>
    </div>

    <!-- Query -->
    <div class="card">
      <h2 class="subtitle">Query</h2>

      <div class="query-grid">
        <div class="qfield">
          <label>Keyword (name contains)</label>
          <input v-model.trim="qKeyword" type="text" placeholder="keyword in name" />
        </div>
        <div class="qfield">
          <label>Min ISBN (≥)</label>
          <input v-model.number="qMinIsbn" type="number" placeholder="0" />
        </div>
        <div class="qfield">
          <label>Order By</label>
          <select v-model="qOrderBy">
            <option value="name">name</option>
            <option value="isbn">isbn</option>
          </select>
        </div>

        <div class="qfield">
          <label>Direction</label>
          <select v-model="qDir">
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>
        <div class="qfield">
          <label>Limit</label>
          <input v-model.number="qLimit" type="number" min="1" placeholder="10" />
        </div>

        <div class="qactions">
          <button class="btn ghost" @click="resetQuery">Reset</button>
          <button class="btn" @click="runQuery" :disabled="loading">
            {{ loading ? 'Loading...' : 'Run Query' }}
          </button>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="card">
      <h2 class="subtitle">Books</h2>
      <div v-if="books.length === 0" class="empty">No data. Try adding or changing query.</div>

      <table v-else class="table">
        <thead>
          <tr>
            <th style="width: 160px">ISBN</th>
            <th>Name</th>
            <th style="width: 210px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in books" :key="b.id">
            <td>
              <template v-if="editId === b.id">
                <input v-model="editIsbn" type="number" class="inrow" />
              </template>
              <template v-else>{{ b.isbn }}</template>
            </td>
            <td>
              <template v-if="editId === b.id">
                <input v-model="editName" type="text" class="inrow" />
              </template>
              <template v-else>{{ b.name }}</template>
            </td>
            <td class="actions">
              <template v-if="editId === b.id">
                <button class="btn small" @click="saveRow(b.id)">Save</button>
                <button class="btn ghost small" @click="cancelEdit">Cancel</button>
              </template>
              <template v-else>
                <button class="btn small" @click="startEdit(b)">Edit</button>
                <button class="btn danger small" @click="removeRow(b.id)">Delete</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/init'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit as qlimit,
  serverTimestamp,
} from 'firebase/firestore'

const COL = collection(db, 'books')

// add form
const isbn = ref('')
const name = ref('')
const adding = ref(false)

// query
const qKeyword = ref('')
const qMinIsbn = ref(null)
const qOrderBy = ref('name')
const qDir = ref('asc')
const qLimit = ref(10)
const loading = ref(false)

// list & edit
const books = ref([])
const editId = ref(null)
const editName = ref('')
const editIsbn = ref('')

const addBook = async () => {
  if (!name.value) {
    alert('Name is required')
    return
  }
  const n = Number(isbn.value)
  if (Number.isNaN(n)) {
    alert('ISBN must be a valid number')
    return
  }

  try {
    adding.value = true
    await addDoc(COL, { isbn: n, name: name.value.trim(), createdAt: serverTimestamp() })
    isbn.value = ''
    name.value = ''
    await runQuery()
    alert('Book added successfully!')
  } catch (e) {
    console.error('Error adding book:', e)
  } finally {
    adding.value = false
  }
}

const runQuery = async () => {
  loading.value = true
  try {
    const filters = []
    if (qMinIsbn.value !== null && qMinIsbn.value !== '' && !Number.isNaN(Number(qMinIsbn.value))) {
      filters.push(where('isbn', '>=', Number(qMinIsbn.value)))
    }
    filters.push(orderBy(qOrderBy.value, qDir.value))
    filters.push(qlimit(Math.max(1, Number(qLimit.value) || 10)))

    const snap = await getDocs(query(COL, ...filters))
    let rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    if (qKeyword.value) {
      const kw = qKeyword.value.toLowerCase()
      rows = rows.filter((r) =>
        String(r.name || '')
          .toLowerCase()
          .includes(kw),
      )
    }
    books.value = rows
  } catch (e) {
    console.error('Error querying books:', e)
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  qKeyword.value = ''
  qMinIsbn.value = null
  qOrderBy.value = 'name'
  qDir.value = 'asc'
  qLimit.value = 10
  runQuery()
}

const startEdit = (row) => {
  editId.value = row.id
  editName.value = row.name
  editIsbn.value = row.isbn
}
const cancelEdit = () => {
  editId.value = null
  editName.value = ''
  editIsbn.value = ''
}
const saveRow = async (id) => {
  const n = Number(editIsbn.value)
  if (Number.isNaN(n)) {
    alert('ISBN must be a valid number')
    return
  }
  try {
    await updateDoc(doc(db, 'books', id), { name: String(editName.value || '').trim(), isbn: n })
    cancelEdit()
    await runQuery()
    alert('Updated!')
  } catch (e) {
    console.error('Error updating:', e)
  }
}
const removeRow = async (id) => {
  if (!confirm('Delete this book?')) return
  try {
    await deleteDoc(doc(db, 'books', id))
    await runQuery()
    alert('Deleted!')
  } catch (e) {
    console.error('Error deleting:', e)
  }
}

onMounted(runQuery)
</script>

<style scoped>
/* layout */
.wrap {
  max-width: 980px;
  margin: 24px auto;
  padding: 0 16px;
  display: grid;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

.title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.subtitle {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
}

/* add form */
.form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.field {
  display: grid;
  gap: 6px;
}

.field input,
.qfield input,
.qfield select,
.inrow {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.field input:focus,
.qfield input:focus,
.qfield select:focus,
.inrow:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 6px;
}

.query-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: end;
}

.qfield {
  display: grid;
  gap: 6px;
}

.qactions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: flex-end;
}

.btn {
  border: none;
  background: #6366f1;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn.ghost {
  background: #eef2ff;
  color: #3730a3;
}

.btn.danger {
  background: #ef4444;
}

.btn.small {
  padding: 6px 10px;
  font-size: 12px;
}

/* table */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.actions {
  display: flex;
  gap: 8px;
}

.empty {
  color: #6b7280;
  padding: 6px 0;
}

/* responsive */
@media (max-width: 860px) {
  .form {
    grid-template-columns: 1fr;
  }

  .query-grid {
    grid-template-columns: 1fr 1fr;
  }

  .toolbar {
    justify-content: stretch;
  }

  .toolbar .btn {
    width: 100%;
  }
}
</style>
