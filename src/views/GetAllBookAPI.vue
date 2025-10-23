<template>
  <pre>{{ pretty }}</pre>
</template>

<script>
import axios from 'axios'

const GET_ALL_BOOKS_URL = 'https://YOUR_ENDPOINT_FOR_GET_ALL_BOOKS'

export default {
  name: 'GetAllBookAPI',
  data() {
    return {
      jsondata: null,
      error: null,
    }
  },
  computed: {
    output() {
      if (this.error) {
        return { error: this.error?.message || String(this.error) }
      }
      return this.jsondata ?? []
    },
    pretty() {
      return JSON.stringify(this.output, null, 2)
    },
  },
  mounted() {
    this.getAllBookAPI()
  },
  methods: {
    async getAllBookAPI() {
      try {
        const { data } = await axios.get(GET_ALL_BOOKS_URL)
        this.jsondata = data
        this.error = null
        return data
      } catch (err) {
        this.error = err
        this.jsondata = null
        return null
      }
    },
  },
}
</script>

<style scoped>
pre {
  margin: 0;
  padding: 0;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  white-space: pre-wrap;
}
</style>
