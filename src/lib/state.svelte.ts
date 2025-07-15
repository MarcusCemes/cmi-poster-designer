export const appState = $state(createAppState());

function createAppState() {
    return {
        formData: createFormData(),
        queueImmediate: false,
    };
}

export function createFormData() {
    return {
        title: "",
        authors: "",
        affiliation: "",
        objective: "",
        perspectives: "",
        publication: "",
        funding: "",
        figures: Array.from({ length: 4 }, createFigure),
    };
}

function createFigure() {
    return {
        image: "",
        caption: "",
    };
}

export function sampleFormData() {
    return {
        title: "The Cosmic Comedy: A Humorous Journey Through Space",
        authors: "Galileo Giggles, Neil Chuckstagram",
        affiliation: "Intergalactic Institute of Humor, Milky Way Galaxy",
        objective:
            "This poster presents a lighthearted exploration of the universe, blending scientific facts with comedic insights. We aim to entertain while educating about the wonders of space, from black holes to cosmic microwave background radiation.",
        perspectives:
            "Humor is a powerful tool for making complex scientific concepts accessible. Future work will focus on integrating more jokes into astrophysics lectures and developing a comedy curriculum for aspiring space comedians.",
        publication: "Published in: Journal of Cosmic Comedy, Vol. 42, 2025",
        funding: "This work was supported by the Galactic Federation of Laughs, Grant #123456.",
        figures: [
            { image: "", caption: "Figure 1: The Big Bang - A Cosmic Joke?" },
            { image: "", caption: "Figure 2: Black Holes - The Universe's Vacuum Cleaners" },
            { image: "", caption: "Figure 3: Dark Matter - The Invisible Prankster" },
            {
                image: "",
                caption: "Figure 4: Cosmic Microwave Background - The Universe's Oldest TV Show",
            },
        ],
    };
}
