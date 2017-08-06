import { put, takeLatest } from "redux-saga/effects";

export const rootSaga: () => any =
    function* (){
        yield takeLatest( 'TEST', f => f );
    };