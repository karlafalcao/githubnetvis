var svgGroup;
var ht_width = 300;
var ht_height = 275;

function buildPainel(){
  var width = 400;
  // var height = 550;

  // margin.top = 45;
  // margin.left = 20;
 
  svgGroup = d3.select("body")
    .append("svg") 
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")           
    .attr("width", width)
    .attr("height", height)    
    .style("background", "#688970");
   
  svgGroup
  	.append("rect") 
    .attr("transform", "translate(" + margin.left + "," + (margin.top + 10) + ")")
    .attr("width", ht_width)
    .attr("height", ht_height + 25)
    .attr("fill", "#c5a688");

  svgGroup
    .append("foreignObject")
    .attr("class", "painel")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + 10) + ")")
    .attr("width", ht_width)
    .attr("height", ht_height + 25)
    .append("xhtml:div")
    .html("<h3 style='text-align: center;'>GithubComplex Network of Developers by city" +
      `
      </br>



      <select style='color: #CFDC; text-decoration: underline; text-underline-offset: 5px;background: transparent;
          font-size: inherit;
          font-family: cursive;'>
          <option>
              
              <u style="color: #CFDC; text-decoration: underline; text-underline-offset: 5px;">Recife</u>
          </option>
      </select>
      </h3>




      ` + 
      "<ul style='padding-inline-start: 20px;padding-inline-end: 10px;'>"+
      "<li>\b Navegue na rede por usuários e veja os seus repositórios próprios e linguagens</li>" +
      "<li>\b Posicione o nó (usuário) na rede ou libere-o quando quiser (use clique+Ctrl)</li>" +
      "<li>\b O tamanho dos nós é proporcional </br>a quantidade de seguidores" + 
      " e as cores representam as comunidades (Louvain Modularity).</li>" +
      "<ul>"
    )

  svgGroup.append("image")
    .attr("class", "painel")
    .attr("xlink:href", "img/github_force.png")
    .attr("transform", "translate(" + margin.left + "," + (ht_height + margin.top)  + ")")
    // .attr("x", "-14px")
    // .attr("y", "-8px")
    .attr("width", ht_width)
    .attr("height", ht_height);
}

function heatmap(user){  
  var ling_repo = {};

  // formatando   
  user.oRepo_Language.forEach(function(lang,i){   
    if (ling_repo[lang] === undefined){
      ling_repo[lang] = [];
      ling_repo[lang].push(user.Repo_Owner[i]);
    } else {
      ling_repo[lang].push(user.Repo_Owner[i]);
    }
  });
  
  var linguagens = d3.keys(ling_repo).sort();
  var xScales = {};
  
  linguagens.forEach(d=>{
	  var temp = d3.scaleBand().domain(ling_repo[d]).range([0, ht_width]); // users: mairatma(outline) henvic
	  xScales[d] = temp;
  });
    
  var yScale = d3.scaleBand().domain(linguagens).range([0, ht_height]);  

  var heatScale = d3.scaleLinear()
    .domain([1,8,15])
    .range(['#74452d', 'cyan', '#688970']) 
    .interpolate(d3.interpolateRgb); 

  var heatMap = svgGroup.append("g")
  	.attr("class", "heatmap")
    .attr("width", ht_width);
    

  // rejoin data 
  var rows = heatMap.selectAll(".row")
  	.data(linguagens);  

  // remove unneeded visualizations
  rows.exit().remove();

  // create new visualizations
  rows.enter()
	  .merge(rows)
	  .append("g")
	  .attr("class", "row");

  // update selections
  heatMap
	  .selectAll(".row")
	  .data(linguagens)
	  .selectAll("rect")
	  .data((x,j)=>ling_repo[x].map(d=>[d,x,j]))
	  .enter()
	  .append("rect")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", function(d){return xScales[d[1]].bandwidth(); })
    .attr("height", function(d){return yScale.bandwidth(); })
	  .attr("x", function(d){return xScales[d[1]](d[0]); })
	  .attr("y", function(d){return yScale(d[1]); })	  
	  .attr("stroke", "white")
	  .attr("fill", d=>heatScale(d[2]))	  
    .append("title").text(function(d) { return d[0]; })
    .on("click", d=>console.log(d));

	var labels = svgGroup.selectAll(".myText")
  	.data(linguagens);

  labels.exit().remove();

  labelsEnter = labels.enter()  
    .append("g")
    .attr("class", "myText");

  labelsEnter.append("text"); 

  labels = labelsEnter.merge(labels);

  labels.select("text")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("x", ht_width+5)
    .attr("y", function(d,i){
      return yScale(d)+yScale.bandwidth()*0.55; })
    .attr("font-family", "Verdana")
    .attr("font-size", 12)
    .attr("fill", "white")
    .text(function(d){return d; }); 
} 