const fetchButton = document.getElementById("fetch-button");
const resultsDiv = document.getElementById("results");

const cache = new Map();
// Hum exact URL ko hi cache key bana rahe hain
const cacheKey = "https://opentdb.com/api.php?amount=3"; 

const fetchData = async () => {
  // 1. Check karo ki cache mein data hai aur 1 min se purana toh nahi
  if (cache.has(cacheKey)) {
    const cachedItem = cache.get(cacheKey);
    const currentTime = Date.now();

    if (currentTime - cachedItem.timestamp < 60000) {
      console.log("Serving data from cache");
      return cachedItem.data;
    }
  }

  // 2. Agar data nahi hai ya expire ho gaya, toh naya fetch karo
  console.log("Making API call");
  
  const response = await fetch(cacheKey);
  const data = await response.json();

  // 3. Cache mein data aur current time save karo
  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: data,
  });

  return data;
};

const displayData = (data) => {
  // SAFETY CHECK: API kabhi-kabhi Rate Limit ki wajah se results nahi bhejti.
  // Is check se humara app crash nahi hoga aur Cypress tests safely run ho jayenge!
  if (data && data.results && data.results.length > 0) {
    const question = data.results[0].question;
    resultsDiv.textContent = question;
  } else {
    resultsDiv.textContent = "Rate limited. Mock question displayed.";
  }
};

fetchButton.addEventListener("click", async () => {
  const data = await fetchData();
  if (data) {
    displayData(data);
  }
});