import React, { createRef } from 'react';
import { FlashMessageParams } from '../types/types';

export const flashMessageRefObj = createRef<any>()

export const show = (params: FlashMessageParams) => {
    if (flashMessageRefObj.current) {
        flashMessageRefObj.current.show(params)
    }
}

export const hide = () => {
    if (flashMessageRefObj.current) {
        flashMessageRefObj.current.hide()
    }
}

const FlashMessageRef = {
    show,
    hide
}

export default FlashMessageRef