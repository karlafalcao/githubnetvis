# This script requires github3.py version 0.9.6
# pip install github3.py

import os
import pandas as pd
from github3 import login

GITHUB_API_TOKEN = os.environ.get('GITHUB_API_TOKEN')
gh = login(token=GITHUB_API_TOKEN)
LOCATION = "Recife"


def to_csv(data, file_name):
    dataFrame = pd.DataFrame(data)
    dataFrame.to_csv(file_name)


def query(nr, location=LOCATION):
    query = [
        "location:{} followers:0".format(location),
        "location:{} followers:1".format(location),
        "location:{} followers:>1".format(location),
        "karlafalcao",
    ]
    return query[nr]


def user_followers(gh_user):
    return [str(u) for u in gh_user.iter_followers()]


def search_users(query):
    return [u.user for u in gh.search_users(query, sort="followers")]

def map_users(node_fn, iterator):
    return [node_fn(gh_user) for gh_user in iterator]

def create_user_node(gh_user):
    return (str(gh_user), gh_user.followers)


def create_followers_node(gh_user):
    return (str(gh_user), user_followers(gh_user))


def main():
    ghusers = map_users(create_followers_node, search_users(query(0)))
    to_csv(ghusers, "recife_users_with_0_followers.csv")

    ghusers = map_users(create_followers_node, search_users(query(1)))
    to_csv(ghusers, "recife_users_with_1_follower.csv")

    ghusers = map_users(create_followers_node, search_users(query(2)))
    to_csv(ghusers, "recife_users_with_gt_1_followers.csv")



if __name__ == '__main__':
    main()


def test_followers(gh_users_graph):
    ''''''
    assert(gh_users_graph == [
        ("karlafalcao",
            ["tuliohmendes", "thiagolmm", "dayvsonlima", "jbwestphal"])
    ])
