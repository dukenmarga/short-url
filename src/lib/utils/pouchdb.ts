export const pouch = {
    // save to pouchdb
    save: async function<T>(db: typeof PouchDB, doc: T){
        await db.put(doc)
    },
    loadAll: async function(db: typeof PouchDB){
        return await db.allDocs({
            include_docs: true
        })
    }
}