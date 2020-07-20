import * as actions from "./actions";

import firebase from "../../../Firebase";

var lastItem = null;

export const search = (query) => async (dispatch, getState) => {
  dispatch(actions.fetchPending());
  dispatch(actions.open());

  const lowerQuery = query.toLowerCase();

  const auth = getState().session.authUser.admin === "admin";

  const allOrAlive = firebase.recipesAllOrAlive(auth);

  const recipesRef = await allOrAlive()
    .orderBy("createdAt")
    // .limit(5)
    //.where("title", "==", query)
    .get();

  const recipesData = recipesRef.docs.map((doc) => doc.data());

  const recipes = Object.values(recipesData).filter((item) =>
    Object.values(item)
      .reduce((item, str) => str + item.toLowerCase(), "")
      .includes(lowerQuery)
  );

  const resUsers = await firebase
    .users()
    .get()
    .then((res) => res.docs.map((doc) => doc.data()));

  const users = Object.values(resUsers).filter((item) =>
    Object.values(item)
      .reduce((item, str) => str + item.toLowerCase(), "")
      .includes(lowerQuery)
  );

  const searchObj = {
    recipes: {
      data: recipes,
      next: null,
    },
    users,
  };
  dispatch(actions.fetchSuccess(searchObj));
};
