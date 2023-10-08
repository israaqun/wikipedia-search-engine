const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results");


function debounce(func, delay) {
    let searchTimeout;
    return function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(func, delay);
    };
}

function clearSearchInput() {
    searchInput.value = ""; 
}

const delayedPerformSearch = debounce(() => {
    performSearch();
    clearSearchInput(); 
}, 500); 

searchInput.addEventListener("input", delayedPerformSearch);

searchButton.addEventListener("click", delayedPerformSearch);

function performSearch() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        alert("Please enter a search term");
        return;
    }

    resultsContainer.innerHTML = "Searching...";

    fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${searchTerm}`
    )
    .then(response => response.json())
    .then(data => {
        displayResults(data.query.search);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        resultsContainer.innerHTML = "An error occurred";
    });
}

function displayResults(results) {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.innerHTML = "No results found";
        return;
    }

    results.forEach(result => {
        const resultElement = document.createElement("div");
        resultElement.classList.add("result-item");
        resultElement.innerHTML = `
            <h2>${result.title}</h2>
            <p>${result.snippet}</p>
            <a href="https://en.wikipedia.org/wiki/${result.title}" target="_blank" class="read-more-button">Read more</a>
        `;
        resultsContainer.appendChild(resultElement);
    });
}