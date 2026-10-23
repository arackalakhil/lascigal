import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!adminEmail || !adminHash) {
          console.error('Admin credentials not set in environment');
          return null;
        }

        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, adminHash);
        if (!isValid) {
          return null;
        }

        return {
          id: 'admin',
          email: adminEmail,
          name: 'Administrator',
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
