"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("af998f3f-e758-42f9-875a-afa0b6f69f21");
    }, []);

    return null;
}
