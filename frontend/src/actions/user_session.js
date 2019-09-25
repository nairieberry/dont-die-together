import * as APIUtil from '../util/session_api_util';
import jwt_decode from 'jwt-decode'

export const RECEIVE_ALL_USERS = "RECEIVE_ALL_USERS";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";

export const receiveErrors = errors => ({
    type: RECEIVE_SESSION_ERRORS,
    errors
});

export const receiveAllUsers = users => ({
    type: RECEIVE_ALL_USERS,
    users
})

export const receiveUsers = users => dispatch => (
    APIUtil.userindex(users).then(() => (
        dispatch(receiveAllUsers())), err => (
            dispatch(receiveErrors(err.response.data))
    ))
)