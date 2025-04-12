import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { APIOutput } from "./types";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export type URL = "/hi" | "/comments" | `/comments/${string}`;

export const callAPI = async <T>({ method, url, payload } : {
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any
}) : Promise<T|null> => {
    try {
        const response = 
            method === "GET" ? await api.get(url, { params : payload }) :
            method === "DELETE" ? await api.delete(url, payload) :
            method === "PUT" ? await api.put(url, payload) :
            await api.post(url, payload);
        const output : APIOutput<T> = response.data;
        
        return output.data ?? null;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
            toast(err.response.data.message); // Show the error message from the response
        } else {
            toast("An error occurred while calling the API."); // Default error message
        }
        return null;
    }
}

export interface Comment {
    id: string;
    text: string;
    image: string;
    likes: number;
    author: string;
    date: string;
    parent: string;
}
