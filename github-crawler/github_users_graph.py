import pandas as pd


recife_users_0 = pd.read_csv("recife_users_with_0_followers.csv")
#print(recife_users_0['User'].head(), "\n")

recife_users_1 = pd.read_csv("recife_users_with_1_follower.csv")
#print(recife_users_1['User'].head(), "\n")

recife_users_gt_1 = pd.read_csv("recife_users_with_gt_1_followers.csv")
#print(recife_users_gt_1['User'].head(), "\n")

recife_users = pd.concat([recife_users_0, recife_users_1, recife_users_gt_1], ignore_index=True)
#print(recife_users.head(), "\n")

dataFrame = pd.DataFrame(recife_users)
dataFrame.to_csv("recife_users.csv")

'''
_________________________IDEIA COM LISTA________________________

'''

recife_ghusers = pd.read_csv("recife_users.csv")

list_user = list(recife_ghusers['User'])
#print(lista_user[1225])

list_followers = list(recife_ghusers['Followers'])
#print(lista_followers[1225])

# testado abaixo - com as listas acima não funcionou
# error: 'str' object has no attribute 'remove'
for row in list_followers:
	for ind in row:
		if not ind in list_user:
			row.remove(ind)
 
'''
#Teste funcionou, exceto qnd não há match

list_user = ['1', 'ba', '3']
list_followers = [['1', 'casa'], [], ['5', '7', '4'], ['2', '3']]

#print("before", list_followers)
print("_____________")
for i in list_followers:
	for y in i:
		if not y in list_user:
			i.remove(y)
#print("after", list_followers)
'''

# inserindo uma nova coluna
recife_users['Recife_Followers'] = list_followers
dataFrame = pd.DataFrame(recife_users)
dataFrame.to_csv("recife_users.csv")
		

'''
_________________________IDEIA COM ITERATOR________________________

'''

# recife_ghusers = pd.read_csv("recife_users.csv", iterator=True)

''' Dúvida abaixo
for recife_ghfollowers in recife_ghusers:
	print(list(recife_ghfollowers['User']))

for recife_ghfollowers in recife_ghusers:	
	print(recife_ghfollowers['Followers'])
'''

''' 
# o primeiro for funciona, mas o segundo não, pq?

for recife_ghfollowers in recife_ghusers:	
	print(recife_ghfollowers['User'])
	
print("____________________________")

# qualquer codigo works
casa = [1,2,3]
print(casa)

for recife_ghfollowers in recife_ghusers:	
	print(recife_ghfollowers['Followers'])
'''


'''
# criando a lista de usuarios	
for recife_ghfollowers in recife_ghusers:
	content = list(recife_ghfollowers['User'])

print("\n\n\n", content)
print("\n\n\n", content[0])
'''



#don't work

'''
# error: name recife_ghfollowers is not defined
for recife_ghfollowers['Followers'] in recife_ghusers:
	print("qualquer coisa", recife_ghfollowers['Followers'])
'''

'''
# baseado em: u.user for u in gh.search_users
recife_ghfollowers['Followers'] for recife_ghfollowers in recife_ghusers:
	print("TESTE")
'''

'''
# error: 'TextFileReader' object is not subscriptable
for recife_ghfollowers in recife_ghusers['Followers']:
	print(recife_ghfollowers)
'''

#_____________________________________________________________
 
'''
# a comparacao esta ao contrario, mas foi só pra testar elemento in lista
# error para 'Series e/ou 'DataFrame': this objects are mutable, thus they cannot be hashed
for recife_ghfollowers in recife_ghusers:	
	if recife_ghfollowers['User'] in recife_ghfollowers['Followers']:
		print("TESTE")
'''

'''
# não pega for aninhado
i = 0
j = 1

for recife_ghfollowers in recife_ghusers:
	#i += 1
	for af in recife_ghfollowers['Followers']:
		#j += 1
		print("fora: ", i, " dentro: ", j)
'''

'''
# algoritmo de uma ideia pra resolver a impossibilidade do for aninhado 

# error: 'TextFileReader' object is not subscriptable
lista = recife_ghusers['Followers'].tolist()

for recife_ghfollowers in recife_ghusers:	
	verificar se recife_ghfollowers['User'] in lista:
		
'''