// this is sales module 
// Provides getDB() and getCollection(name) used across option and order modules.
export const getDB = async () => {
  if (typeof window !== 'undefined' && window.__HOH_DB__) return window.__HOH_DB__

  const resp = await fetch('./api/database.json')
  if (!resp.ok) throw new Error(`Failed to load database.json: ${resp.status}`)
  const db = await resp.json()

  if (typeof window !== 'undefined') window.__HOH_DB__ = db
  return db
}

export const getCollection = async (name) => {
  const db = await getDB()
  return db[name] || []
}
