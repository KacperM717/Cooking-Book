import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import CreateRecipePage from "../CreateRecipe";

import * as ROUTES from "../../constants/routes";

import { withAuthentication } from "../Session";
import { CssBaseline } from "@material-ui/core";

import Header from "../Header";
import { useSelector, useDispatch } from "react-redux";

import firebase from "../../Firebase";
import { sessionOperations } from "../../store/reducers/session";
import RecipesContainer from "../Recipes/Container";
import EditPage from "../Edit";
import UserRecipes from "../UserRecipes";
import ErrorSnackBar from "../Error";

const App = () => {
  const dispatch = useDispatch();

  const searchOpen = useSelector((state) => state.search.open);
  const authUser = useSelector((state) => state.session.authUser);
  if ((!authUser || authUser.id !== firebase.auth.W) && firebase.auth.W) {
    dispatch(sessionOperations.getAuthUser(firebase.auth.W));
  }

  return (
    <Router>
      <div
        style={{ backgroundColor: "rgba(245,245,245,1)", minHeight: "100vh" }}
      >
        <CssBaseline />
        <Header />
        <ErrorSnackBar multiple={false} delay={3500} />
        {searchOpen ? (
          <RecipesContainer
            msg={"No recipes founds"}
            selectOp={(state) => state.search}
            getOp={null}
            storeSrc={"search"}
          />
        ) : (
          <div>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            {authUser && (
              <>
                <Route path={ROUTES.HOME} component={HomePage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.ADMIN} component={AdminPage} />
                <Route path={ROUTES.RECIPE_NEW} component={CreateRecipePage} />
                <Route path={ROUTES.RECIPE_EDIT} component={EditPage} />
                <Route path={ROUTES.USER_RECIPES} component={UserRecipes} />
              </>
            )}
            <Redirect path="/" component={LandingPage} />
          </div>
        )}
      </div>
    </Router>
  );
};

export default withAuthentication(App);
