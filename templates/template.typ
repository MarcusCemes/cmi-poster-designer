#import "@preview/based:0.2.0": base64

#let render_image(data, format: "png") = {
  let decoded = base64.decode(data)

  image(
    decoded,
    format: format,
    width: 184pt,
    height: 142pt,
    fit: "contain",
  )
}


#let create_figure(x: length, y: length, data: (image: str, caption: str), label: str) = {
  if data != none and data.image != "" {
    place(dx: x, dy: y, {
      if data.image.starts-with("data:image/jpeg;base64,") {
        render_image(data.image.slice(23), format: "jpg")
      } else if data.image.starts-with("data:image/png;base64,") {
        render_image(data.image.slice(22), format: "png")
      } else if data.image.starts-with("data:image/svg+xml;base64,") {
        render_image(data.image.slice(26), format: "svg")
      }
    })

    place(dx: x + 35pt, dy: y + 153pt, box(width: 150pt, height: 30pt, text(size: 7pt, data.caption)))
    place(dx: x + 4.25pt, dy: y + 151.5pt, box(width: 30pt, height: 8pt, text(size: 7pt, label)))
  }
}


#let poster(
  title: "Exploring the Cosmos: A Journey Through Space Exploring the Cosmos: A Journey Through Space Exploring the Cosmos",
  authors: "Dr. Evelyn Reed, Dr. Samuel Vance",
  affiliation: "Starlight Observatory & Research Center",
  objective: "To analyze and categorize newly discovered celestial bodies and their potential for harbouring life, using data from the Kepler and TESS space telescopes.",
  perspectives: "Future research will focus on atmospheric composition analysis of the most promising exoplanets. We also aim to secure funding for a dedicated deep-space probe.",
  publication: "Journal of Celestial Astrophysics, Vol. 42, Issue 3",
  funding: "Funded by the International Space Exploration Grant #734-B",
  figures: (
    (image: "", caption: "The Orion Nebula"),
    (image: "", caption: "A star-forming region in the Large Magellanic Cloud"),
    (image: "", caption: "The Andromeda Galaxy"),
    (image: "", caption: "A composite image of the Milky Way"),
  ),
  watermark: "",
) = {
  let foreground = none

  if watermark != "" {
    foreground = rotate(-45deg, text(size: 150pt, fill: rgb(0, 0, 0, 10%), watermark))
  }

  set page(
    paper: "a4",
    margin: 0mm,
    background: image("background.svg", width: 100%, height: 100%),
    foreground: foreground,
  )

  set text(font: "Linux Libertine", lang: "en")

  // DEBUG: Uncomment to set a box background color
  // set box(fill: oklch(56.53%, 0.23, 29deg, 25%))

  // Title
  place(dx: 40pt, dy: 116pt, box(width: 516pt, height: 42pt, align(center + horizon, par(leading: 0.5em, text(
    size: 18pt,
    weight: "black",
    title,
  )))))

  // Authors
  place(dx: 42pt, dy: 61pt, text(size: 6pt, "Authors"))
  place(dx: 43pt, dy: 70pt, box(width: 155pt, height: 40pt, text(size: 8pt, authors)))

  // Affiliation
  place(dx: 400pt, dy: 61pt, text(size: 6pt, "Affiliation"))
  place(dx: 400pt, dy: 70pt, box(width: 155pt, height: 40pt, text(size: 8pt, affiliation)))

  // Objective
  place(dx: 75pt, dy: 165pt, text(size: 8pt, "Project Objectives"))
  place(dx: 40pt, dy: 180pt, box(width: 516pt, height: 92pt, objective))

  let figure_positions = (
    (x: 45pt, y: 286pt, label: "Figure 1"),
    (x: 307pt, y: 286pt, label: "Figure 2"),
    (x: 41pt, y: 493.5pt, label: "Figure 3"),
    (x: 304pt, y: 493.5pt, label: "Figure 4"),
  )

  for ((x, y, label), figure) in figure_positions.zip(figures) {
    create_figure(
      x: x,
      y: y,
      data: figure,
      label: label,
    )
  }

  // Perspectives & Development
  place(dx: 75pt, dy: 681pt, text(size: 7pt, "Perspectives & Development"))
  place(dx: 40pt, dy: 694pt, box(width: 516pt, height: 54pt, text(size: 10pt, perspectives)))

  // Publication
  place(dx: 75pt, dy: 751.5pt, text(size: 7pt, "Publication"))
  place(dx: 200pt, dy: 753pt, box(width: 284pt, height: 22pt, text(size: 7pt, publication)))

  // Funding
  place(dx: 75pt, dy: 781pt, text(size: 7pt, "Funding"))
  place(dx: 200pt, dy: 782pt, box(width: 284pt, height: 22pt, text(size: 7pt, funding)))
}
