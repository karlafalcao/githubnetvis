# github-networks

In this preliminary study, we only study a sample of projects and developers in GitHub. In the future, we plan to mitigate this threat further by including more projects and developers.

Another threat to validity is that we consider two developers to be linked as long as they are located in the same city.

# Gephi é um programa de vizualização de Redes Complexas.

O arquivo edges.csv foi importado para o Gephi, onde foram obtidas
algumas propriedades dos nós dessas arestas, como In-Degree
(número de seguidores que também foi calculado na scraping dos dados),  
Modularity Class e Eigen Centrality.
Então exportou-se os nós, juntamente com essas propriedades,
para o arquivo 'node_metrics.csv' ou 'node_data.csv', que se encontra em 'recife/'.

# requirements

Jupyter notebook
Python 3
pandas version==0.22.0
github3.py version==0.9.6
