# Build Stage
FROM ubuntu:22.04 AS builder

# Install Bun and required tools
RUN apt-get update && apt-get install -y curl unzip && \
  curl -fsSL https://bun.sh/install | bash && \
  ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Set PATH for Bun
ENV PATH="/usr/local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the Next.js app
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
RUN bun --bun next build

# Production Stage
FROM ubuntu:22.04 AS runner

# Set PATH for Bun
ENV PATH="/usr/local/bin:$PATH"

# Install Bun in the final image
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  unzip \
  && curl -fsSL https://bun.sh/install | bash \
  && ln -s /root/.bun/bin/bun /usr/local/bin/bun \
  && apt-get clean \


  && rm -rf /var/lib/apt/lists/* \
  && bun --version  # Verify Bun installation

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variables at runtime
ENV PORT=3000
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

# Run the app
CMD ["bun", "server.js"]