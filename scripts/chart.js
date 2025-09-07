function showChartStats(pokemon) {
    const ctx = document.getElementById("pokemonStats");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "HP",
                "Attack",
                "Defense",
                "Special-Attack",
                "Special-Defense",
                "Speed",
            ],
            datasets: [{
                data: [
                    pokemon.stats[0]["base_stat"],
                    pokemon.stats[1]["base_stat"],
                    pokemon.stats[2]["base_stat"],
                    pokemon.stats[3]["base_stat"],
                    pokemon.stats[4]["base_stat"],
                    pokemon.stats[5]["base_stat"]
                ],
                backgroundColor: [
                    "#d8690eff",
                    "#6bf85bff",
                    "#86D2F5",
                    "#5a0016ff",
                    "#a7099aff",
                    "#290355ff",
                ],
                borderWidth: 0,
                borderRadius: 50,
            }, ],
        },
        options: {
            indexAxis: "y",
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        fontColor: '#f00'
                    }
                },
                tooltip: {
                    enabled: false,
                },
                datalabels: {
                    color: 'white',
                    font: {
                        family: 'pokeBit',
                        size: 10,
                    }
                }
            },
        },
        plugins: [ChartDataLabels]
    });
}