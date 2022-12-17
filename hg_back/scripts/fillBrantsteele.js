function fill() {
    for (let i = 0; i < 24; i++) {
        let id = (i + 1).toString().padStart(2, "0");
        let input = document.getElementById(`cusTribute${id}`);
        input.value = id;
    }

    document.getElementsByClassName("MakeEvictedNames")[0].click();
    document.getElementsByClassName("MakeEvictedSkip")[0].click();
}

fill();