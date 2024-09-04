# Midnight hackathon: Anonymous Q&A dashboard.

## Quick Start

1. Clone the Hackaton github repository:
```bash
git clone https://github.com/tainabugs/hackathon-midnight-2.git
cd hackathon-midnight-2
```

2. Install dependencies:
```bash
yarn install
```

3. Create a .env.local file and set up environment variables
```bash
NEXT_PUBLIC_NETWORK_ID=devnet
NEXT_PUBLIC_LOGGING_LEVEL=trace
CONVEX_DEPLOYMENT=dev:blessed-clam-311 
NEXT_PUBLIC_CONVEX_URL=https://blessed-clam-311.convex.cloud
```

4. Run the development server:
```bash
yarn dev
```

5. Open http://localhost:3000 in your browser.

6. If you just want to test out the Dapp without installing it on your local machine. There is a live Demo available at: midnighthackathon.eddalabas.io

7. For executing contracts on Midnight you will need to have a Midnight wallet and a proof server. Please follow instructions in the following link:
   https://docs.midnight.network/develop/tutorial/using/prereqs


## Key features

- User-Friendly Interface: Animations, clean UI and intuitive UX
- Reactive Database integration: Enables seamless connection to a reactive database, ensuring multiple users receive real-time updates without requiring a page refresh.
- RxJs library and reactive indexing: The Midnight indexer provides reactive updates, so RxJs was utilized to maintain the application's reactivity by working with observables and subscriptions.
- Transaction Management: Allows users to create, sign, proof and submit transactions directly from the frontend.
- Compact smart contracts and ZK circuits: Code developed on Compact language was compiled to create a TypeScript-based API, abstracting the logic for users to submit questions anonymously, while allowing others to respond anonymously as well
- Proof server integration & Dapp connector: The Midnight wallet dApp connector seamlessly communicates with the application UI, as well as the indexer, node, and proof server.
- Nextjs and App Router: The implementation was carried out using the latest version of Next.js and the app router to showcase the compatibility of Midnight libraries with a framework utilized by millions of developers.
- The code will be fully open-source, fostering collaboration with the community.
  