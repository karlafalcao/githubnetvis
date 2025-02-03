let margin = { top: 10, left: 10, bottom: 10, right: 20 };
let width = 850; // 1000
let height = 550; // 650

// zoom settings
let scaleFactor = 0.25;
let translateFactor = [1200, 700];
let zoomCentered = null;
let zoomLevel = 0.5;

const header = d3.select("body").append("header");
header.append("h2").text("Github Followers Network");
header.append("span").text("☕️");

d3.select("body").on("contextmenu", (d) => {
  d3.event.preventDefault();
  return false;
});

const baseUrl = window.location.origin;

// dataset
d3.csv(baseUrl + "/data/recife/edges.csv", function (error_e, edges) {
  d3.csv(baseUrl + "/data/recife/node_data.csv", function (error_n, csv) {
    if (error_e || error_n) {
      console.log(error_e + error_n);
    } else {
      // console.log("edges:", csv);
      let data_cf = crossfilter(csv);
      buildGraph(edges, data_cf);
      buildPainel();
    }
  });
});

function buildGraph(edges, data_cf) {
  let links = edges;
  let nodesConected = {};
  let nodes = [];

  let node_data_dm = data_cf.dimension(function (d) {
    return d["User"];
  });
  let node_data = node_data_dm.bottom(Infinity);

  let interval = d3.extent(node_data, (d) => parseInt(d.In_Degree));
  let rScale = d3.scaleLinear().domain(interval).range([5, 25]);

  let qtd = {};
  node_data.map((e) => {
    return (qtd[e.Modularity_Class] = qtd[e.Modularity_Class] + 1 || 1);
  });
  let colorScale = d3
    .scaleSequential(d3.interpolateCool)
    .domain([-3, d3.keys(qtd).length]); // interpolateRainbow interpolateCool

  let initialTransform = d3.zoomIdentity.scale(1.5).translate(-120, -60);

  links.forEach(function (link) {
    link.source =
      nodesConected[link.source] ||
      (nodesConected[link.source] = { User: link.source });
    link.target =
      nodesConected[link.target] ||
      (nodesConected[link.target] = { User: link.target });
  });

  // let nodes = d3.values(nodesConected);
  // ordenando
  d3.keys(nodesConected)
    .sort()
    .forEach(function (v, i) {
      nodes[i] = nodesConected[v];
    });

  // normalizacao
  node_data.forEach(function (d) {
    // a principio adotei apenas os repositorios proprios
    d.Repo_Owner = d.Repo_Owner.split(",");
    d.oRepo_Language = d.oRepo_Language.split(",");
  });

  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("rect")
    .attr("height", height)
    .attr("width", width)
    .attr("x", 0)
    .attr("y", 0)
    .attr("stroke", "grey")
    .attr("fill", "none")
    .attr("stroke-width", "4px");

  let graph = svg
    .append("g")
    .attr("class", "complexNetwork")
    .attr(
      "transform",
      "scale(" +
        scaleFactor +
        ")translate(" +
        translateFactor[0] +
        "," +
        translateFactor[1] +
        ")",
    );

  let link = graph
    .append("g")
    .attr("class", "links")
    .selectAll("links")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "#c5a688")
    .style("stroke-width", "1px");

  let node = graph
    .append("g")
    .attr("class", "nodes")
    .selectAll("nodes")
    .data(nodes)
    .enter()
    .append("g")
    .attr("cursor", "cell");

  let circle = node
    .append("circle")
    .attr("r", (d, i) => rScale(3 * parseInt(node_data[i].In_Degree)))
    .attr("fill", (d, i) => colorScale(parseInt(node_data[i].Modularity_Class)))
    .attr("stroke", "white")
    .attr("stroke-width", "2px");

  let label = node
    .append("text")
    .attr("font-family", "Verdana")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.User;
    });

  let forceDirGraph = d3
    .forceSimulation()
    .nodes(nodes)
    .force("links", d3.forceLink(links));

  forceDirGraph
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    //.force("radial",d3.forceRadial().radius(1.5))
    .force(
      "collision",
      d3
        .forceCollide()
        .radius(
          (d, i) => 3 * parseInt(node_data[i].In_Degree) + 5 /*normalizacao*/,
        ),
    );

  // permite a continuacao drag_handler após o fim da simulacao
  forceDirGraph.on("tick", tick_actions).on("end", function () {
    node.each(function (d) {
      d.fx = d.x;
      d.fy = d.y;
    });
  });

  let zoom_handler = d3.zoom().on("zoom", zoom_actions);

  zoom_handler(svg);

  node.on("click", clicked);

  let drag_handler = d3
    .drag()
    .on("start", drag_start)
    .on("drag", drag_drag)
    .on("end", drag_end);

  drag_handler(node);

  // navegacao por node
  // liberacao do node
  function clicked(d, i) {
    let x;
    let y;
    let level;

    if (!d3.event.ctrlKey) {
      if (zoomCentered !== d) {
        x = d.x;
        y = d.y;
        level = 3 * zoomLevel;
        zoomCentered = d;

        zoom_update();
        graph_update();
        d3.select(this).select("circle").style("fill", "#74452d");

        heatmap & heatmap(node_data[i]);
        // console.log("Dados do usuario:", node_data[i]);
      } else {
        x = width / 2;
        y = height / 2;
        level = 0.8 * zoomLevel;
        zoomCentered = null;

        links_update();
        d3.select(this)
          .select("circle")
          .style("fill", colorScale(parseInt(node_data[i].Modularity_Class)));
      }
      graph
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr(
          "transform",
          "translate(" +
            width / 2 +
            "," +
            height / 2 +
            ")scale(" +
            level +
            ")translate(" +
            -x +
            "," +
            -y +
            ")",
        );

      // o usuario libera o nó que fixou
    } else {
      d.fx = null;
      d.fy = null;

      links_update();
      d3.select(this)
        .select("circle")
        .style("fill", colorScale(parseInt(node_data[i].Modularity_Class)));
    }
  }

  function zoom_actions() {
    let transform = d3.event.transform
      .scale(scaleFactor)
      .translate(translateFactor[0], translateFactor[1]);
    graph.attr("transform", transform);
    // console.log(transform);
  }

  function zoom_update() {
    svg
      .transition()
      .duration(1000)
      .call(zoom_handler.transform, initialTransform);
  }

  function graph_update() {
    upNodes = graph
      .selectAll("circle")
      .style("fill", (d, i) =>
        colorScale(parseInt(node_data[i].Modularity_Class)),
      );
    upLink = graph.selectAll("line").style("stroke", "#c5a688");
  }

  function links_update() {
    upLink = graph.selectAll("line").style("stroke", "#c5a688");
  }

  function ego_net(user) {
    let follower = false;

    egoLink = graph.selectAll("line").style("stroke", (d) => {
      if (user == d.target.User) {
        follower = true;
        return "#74452d"; // "red"; "#74452d";
      } else if (user == d.source.User && !follower) {
        return "#1c4d25"; // "orange" #1c4d25
      } else {
        // return "#dbc3aa"; // update enable || disable
      }
    });
  }

  function drag_start(d) {
    if (!d3.event.active) forceDirGraph.alphaTarget(0.5).restart();
    d.fx = d.x;
    d.fy = d.y;

    links_update();
    d3.select(this).select("circle").style("fill", "#74452d");
    ego_net(d.User);
  }

  function drag_drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  // o usuario fixa a posicao do nó
  function drag_end(d) {
    if (!d3.event.active) forceDirGraph.alphaTarget(0);
    d.fx = d.x;
    d.fy = d.y;
  }

  function tick_actions() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    circle
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });

    label.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }

  // heatmap(node_data[2]);
}
