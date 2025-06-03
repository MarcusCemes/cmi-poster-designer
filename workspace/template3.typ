#import "@preview/based:0.2.0": base64

#let render_image(data, x: 0mm, y: 0mm, format: "png") = {
  let decoded = base64.decode(data)

  place(
    dx: x,
    dy: y,
    image.decode(
      decoded,
      format: format,
      width: 65mm,
      height: 50mm,
      fit: "contain",
    ),
  )
}

#let figure_with_caption(data, caption, x: 0mm, y: 0mm) = {
  if data.starts-with("data:image/jpeg;base64,") {
    render_image(
      data.slice(23),
      x: x,
      y: y,
      format: "jpg",
    )
  } else if data.starts-with("data:image/png;base64,") {
    render_image(
      data.slice(22),
      x: x,
      y: y,
      format: "png",
    )
  } else if data.starts-with("data:image/svg+xml;base64,") {
    render_image(
      data.slice(26),
      x: x,
      y: y,
      format: "svg",
    )
  }

  // if data != "" {
  //   place(
  //     dx: x,
  //     dy: y,
  //     image(
  //       base64.decode(data),
  //       width: 65mm,
  //       height: 50mm,
  //       fit: "contain",
  //       format: "jpg",
  //     ),
  //   )
  // }

  place(
    dx: x + 1.5mm,
    dy: y + 53.5mm,
    box(width: 65mm, height: 10mm, text(size: 7pt, caption)),
  )
}

#let poster(
  title: "Title",
  authors: "Authors",
  affiliation: "Affiliation",
  objective: "Objective",
  perspectives: "Perspectives",
  publication: "Publication",
  funding: "Funding",
  figure1,
  figure2,
  figure3,
  figure4,
  figure1_caption: "Figure 1",
  figure2_caption: "Figure 2",
  figure3_caption: "Figure 3",
  figure4_caption: "Figure 4",
  page_number: "23",
) = {
  set page(
    paper: "a4",
    margin: 0mm,
    background: image("background.svg", width: 100%, height: 100%),
  )

  // Title
  place(
    dx: 14mm,
    dy: 42.5mm,
    box(width: 182mm, height: 17mm, align(center, text(size: 18pt, weight: "black", title))),
  )

  // Authors
  place(
    dx: 14mm,
    dy: 24mm,
    box(width: 55mm, height: 14mm, text(size: 8pt, authors)),
  )

  // Affiliation
  place(
    dx: 140mm,
    dy: 24mm,
    box(width: 55mm, height: 14mm, text(size: 8pt, affiliation)),
  )

  // Objective
  place(
    dx: 14mm,
    dy: 63mm,
    box(width: 182mm, height: 32mm, objective),
  )

  // Figures
  figure_with_caption(figure1, figure1_caption, x: 26.5mm, y: 101mm)
  figure_with_caption(figure2, figure2_caption, x: 121.5mm, y: 101mm)
  figure_with_caption(figure3, figure3_caption, x: 26.5mm, y: 174mm)
  figure_with_caption(figure4, figure4_caption, x: 121.5mm, y: 174mm)

  // Perspectives & Development
  place(
    dx: 14mm,
    dy: 244mm,
    box(width: 182mm, height: 20mm, text(size: 10pt, perspectives)),
  )

  // Publication
  place(
    dx: 80mm,
    dy: 265mm,
    box(width: 100mm, height: 8mm, text(size: 7pt, publication)),
  )

  // Funding
  place(
    dx: 80mm,
    dy: 275.5mm,
    box(width: 100mm, height: 8mm, text(size: 7pt, funding)),
  )
}
