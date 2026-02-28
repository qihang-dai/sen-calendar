const BASE_URL = 'https://api.jsonbin.io/v3'

// Create a new bin with initial empty data
export async function createBin(masterKey) {
  const res = await fetch(`${BASE_URL}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': masterKey,
      'X-Bin-Name': 'sen-wellbeing',
      'X-Bin-Private': 'true',
    },
    body: JSON.stringify({ days: {} }),
  })
  if (!res.ok) throw new Error(`Failed to create bin: ${res.status}`)
  const data = await res.json()
  return data.metadata.id
}

// Fetch latest data from bin
export async function fetchBin(masterKey, binId) {
  const res = await fetch(`${BASE_URL}/b/${binId}/latest`, {
    headers: { 'X-Master-Key': masterKey },
  })
  if (!res.ok) throw new Error(`Failed to fetch bin: ${res.status}`)
  const data = await res.json()
  return data.record
}

// Save data to bin
export async function saveBin(masterKey, binId, payload) {
  const res = await fetch(`${BASE_URL}/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': masterKey,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to save bin: ${res.status}`)
  return res.json()
}
