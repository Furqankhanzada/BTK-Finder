import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
    noReviewsAvailable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButton: {
        padding: 5,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 15,
        marginLeft: 5
    }
});
