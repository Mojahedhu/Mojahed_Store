# ---------- 1. Base image ----------
FROM node:20-alpine
# ---------- 2. Create app directory ----------
WORKDIR /app

# ---------- 3. Copy package files ----------
# ---------- 4. Install dependencies ----------

# ----------- INSTALL ROOT DEPS -----------
COPY package*.json ./
RUN npm install

# ----------- INSTALL BACKEND -----------
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# ----------- INSTALL FRONTEND -----------
COPY frontEnd/package*.json ./frontEnd/
RUN cd frontEnd && npm install



# ---------- 5. Copy source code ----------
COPY . .

# ---------- 6. Build frontend ----------
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY
# ---------- 7. Build backend TS ----------
RUN cd frontEnd && npm run build  && cd ../backend && npm run build 

# ---------- 9. Expose port ----------
ENV NODE_ENV=production
EXPOSE 5000

# ---------- 10. Start server ----------
CMD [ "node", "backend/dist/index.js" ]