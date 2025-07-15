import type { User, Session } from "$lib/server/db/schema";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user?: User;
            session?: Session;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
