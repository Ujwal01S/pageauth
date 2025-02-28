import NextAuth from "next-auth";

import { getServerSession, NextAuthOptions, Session } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/schema/loginSchema";
import { baseUrl } from "@/libs/api";

export const options: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (credentials == undefined) return null;
                try {
                    const validatedFields = loginSchema.safeParse(credentials);
                    const response = await fetch(`${baseUrl}/api/login`, {
                        method: "POST",
                        body: JSON.stringify(validatedFields?.data),
                        headers: { 'Content-Type': 'application/json' }
                    })
                    if (!response.ok) {
                        throw await response.json();
                    }
                    const data = await response.json();
                    const userData = {
                        id: data.data.id,
                        name: data.data.name,
                        email: data.data.email,
                        role: data.data.role,
                        image: data.data.image
                    }
                    return userData;
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message)
                    } else {
                        if (typeof error === 'object' && error !== null && 'message' in error) {
                            throw new Error(`Authorization Failed: ${(error as Error).message}`);
                        } else {
                            throw new Error('Authorization Failed: Unknown error');
                        }
                    }
                }
            },
        })
    ],
    pages: {
        signIn: "/signIn"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            // initially token has only the default value name, sub, email, picture 
            token = { ...token, ...user }
            // after spreding user we have all above , image, role, id
            // console.log(token);
            return token
        },
        async session({ token, session }) {
            if (session.user) {
                // session contains user the jwt is 1st triggered which sets session default value and we add rest of values to session user adding session and token
                const newSession = {
                    ...session,
                    user: { ...session.user, ...token }
                }
                // console.log({ newSession });
                // This clg has all of session + image, id, role
                return newSession

            }
            // console.log({ session });
            // the above clg only has name, email, image inside user
            return session
        }
    },
    session: {
        strategy: "jwt"
    }

}

export const getUserSession = (): Promise<Session | null> => {
    return getServerSession(options)
}

export default NextAuth(options);

