export default {
  state: {
    tables: []
  },
  getters: {
    curTables () {
      return sessionStorage.tables ? JSON.parse(sessionStorage.tables) : []
    },
    nextTable () {
      const { curTables } = arguments[1]
      return curTableName => {
        const index = curTables.indexOf(curTableName)
        if (index !== -1 && index + 1 !== curTables.length) return curTables[index + 1]
        return false
      }
    }
  },
  mutations: {
    SET_TABLES_TITLE (state, tables) {
      sessionStorage.tables = JSON.stringify(tables)
      state.tables = tables
    }
  },
  actions: {
  }
}
