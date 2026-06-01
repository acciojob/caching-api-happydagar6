const fetchButton = document.getElementById("fetch-button");
const resultsDiv = document.getElementById("results");

const cache = new Map();
const cacheKey = "triviaData"; // Ek key define ki taaki data ko pehchan sakein

const fetchData = async () => {
  // 1. Check karo ki kya humare cache mein pehle se data pada hai?
  if (cache.has(cacheKey)) {
    const cachedItem = cache.get(cacheKey);
    const currentTime = Date.now();

    // 2. Check karo ki kya data 1 minute (60,000 milliseconds) se naya hai?
    if (currentTime - cachedItem.timestamp < 60000) {
      console.log("Serving data from cache"); // Requirement met: exact console log
      return cachedItem.data;
    }
  }

  // 3. Agar data cache mein nahi hai, ya 1 minute se purana (expire) ho gaya hai, 
  // toh nayi API call karo.
  console.log("Making API call"); // Requirement met: exact console log
  
  // (Assignment prompt mein RapidAPI aur openTDB dono ka mention tha, 
  // lekin tumhare JS code mein opentdb tha, isliye wahi use kiya hai)
  const response = await fetch("https://opentdb.com/api.php?amount=3");
  const data = await response.json();

  // 4. Naye aaye data aur current time ko cache mein save kar do agle 1 min ke liye
  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: data,
  });

  return data;
};

const displayData = (data) => {
  const question = data.results[0].question;
  resultsDiv.textContent = question;
};

fetchButton.addEventListener("click", async () => {
  const data = await fetchData();
  displayData(data);
});