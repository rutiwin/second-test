document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchBtn = document.getElementById('searchBtn');
    const allBtn = document.getElementById('allBtn');
    const resultsDiv = document.getElementById('results');

    searchBtn.addEventListener('click', function () {
        const countryName = document.getElementById('countryName').value;
        searchCountry(countryName);
        clearInput();
    });

    allBtn.addEventListener('click', function () {
        getAllCountries();
        clearInput();
    });

    function clearInput() {
        document.getElementById('countryName').value = '';
    }

    async function searchCountry(name) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            displayError('Error fetching data. Please try again later.');
        }
    }

    async function getAllCountries() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            displayError('Error fetching data. Please try again later.');
        }
    }

    function displayResults(countries) {
        const totalCountries = countries.length;
        const totalPopulation = countries.reduce((acc, country) => acc + (country.population || 0), 0);
        const averagePopulation = totalPopulation / totalCountries;

        let countriesTable = '<table class="table table-striped"><thead><tr><th>Country Name</th><th>Population</th><th>Currency</th></tr></thead><tbody>';
        const currencyCount = {};

        countries.forEach(country => {
            const currency = country.currencies && Object.keys(country.currencies).length > 0 ? Object.keys(country.currencies)[0] : 'Unknown';
            countriesTable += `<tr><td>${country.name.common}</td><td>${country.population || 'N/A'}</td><td>${currency}</td></tr>`;
            currencyCount[currency] = (currencyCount[currency] || 0) + 1;
        });
        countriesTable += '</tbody></table>';

        const regions = {};
        countries.forEach(country => {
            const region = country.region || 'Unknown';
            regions[region] = (regions[region] || 0) + 1;
        });

        let regionsTable = '<table class="table table-striped"><thead><tr><th>Region</th><th>Number of Countries</th></tr></thead><tbody>';
        for (const region in regions) {
            regionsTable += `<tr><td>${region}</td><td>${regions[region]}</td></tr>`;
        }
        regionsTable += '</tbody></table>';

        let currenciesTable = '<table class="table table-striped"><thead><tr><th>Currency</th><th>Number of Countries</th></tr></thead><tbody>';
        for (const currency in currencyCount) {
            currenciesTable += `<tr><td>${currency}</td><td>${currencyCount[currency]}</td></tr>`;
        }
        currenciesTable += '</tbody></table>';

        const statisticsHTML = `
            <p>Total countries result: ${totalCountries}</p>
            <p>Total Countries Population: ${totalPopulation}</p>
            <p>Average Population: ${averagePopulation.toFixed(2)}</p>
            <h2>Countries and their Population:</h2>
            ${countriesTable}
            <h2>Region-wise Distribution:</h2>
            ${regionsTable}
            <h2>country currency:</h2>
            ${currenciesTable}
        `;

        resultsDiv.innerHTML = statisticsHTML;
    }

    function displayError(message) {
        resultsDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
});