/* eslint-env node */

const { setGlobalOptions } = require("firebase-functions/v2")
const { onRequest } = require("firebase-functions/v2/https")
const logger = require("firebase-functions/logger")

const admin = require("firebase-admin")
const cors = require("cors")({ origin: true })

const { onDocumentCreated } = require("firebase-functions/v2/firestore")

setGlobalOptions({ maxInstances: 10 })
admin.initializeApp()

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection("books").get()
      res.status(200).send({ count: snapshot.size })
    } catch (error) {
      logger.error("Error counting books:", error)
      res.status(500).send("Error counting books")
    }
  })
})

exports.uppercaseBookOnCreate = onDocumentCreated(
  { document: "books/{bookId}", region: "australia-southeast1" },
  async (event) => {
    const snap = event.data
    if (!snap) return

    const data = snap.data() || {}
    const updated = {}
    let changed = false

    const toUpper = (v) =>
      typeof v === "string"
        ? v.toUpperCase()
        : Array.isArray(v)
          ? v.map((x) => (typeof x === "string" ? x.toUpperCase() : x))
          : v

    for (const [k, v] of Object.entries(data)) {
      const u = toUpper(v)
      if (u !== v) {
        updated[k] = u
        changed = true
      }
    }

    if (!changed) return
    try {
      await snap.ref.update(updated)
      logger.info("Uppercased new book", { id: snap.id, fields: Object.keys(updated) })
    } catch (err) {
      logger.error("Failed to uppercase new book", err)
    }
  },
)
