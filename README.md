# CloudCanvas

CloudCanvas is an interactive React and Next.js experience that teaches AWS architecture through a real payment system narrative. Instead of static slides, users build an architecture canvas, run a simulated payment journey, review evidence, and understand why cloud design choices matter.

## Highlights

- Interactive architecture canvas with 10 AWS services
- Service-level learning tabs: what, why, and how
- Payment flow demo player with service highlighting
- Evidence wall ready for real AWS screenshot proof
- Cost and deployment storytelling for presentation use
- Mermaid documentation for architecture and process diagrams

## AWS Services Covered

- VPC
- IAM
- EC2
- RDS
- S3
- Lambda
- API Gateway
- CloudFront
- ELB
- CloudWatch

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Quick Start

### 1) Install dependencies

```bash
pnpm install
```

### 2) Run development server

```bash
pnpm exec next dev --webpack -p 3000
```

Open http://localhost:3000

### 3) Production preview locally

```bash
pnpm build
pnpm start
```

## Data and Logic Layer

Primary logic and data modules:

- src/data/services.ts
- src/data/demoSteps.ts
- src/data/evidence.ts
- src/hooks/useArchitectureCanvas.ts
- src/hooks/useDemoPlayer.ts

These files are intentionally structured so UI components can consume them without prop API changes.

## Mermaid Diagrams

### 1) System Architecture

```mermaid
flowchart LR
	U[User Browser] --> CF[CloudFront]
	CF --> ELB[Elastic Load Balancer]
	ELB --> EC2[EC2 Spring Boot Services]
	EC2 --> RDS[(RDS PostgreSQL)]
	EC2 --> S3[(S3 Receipts)]
	EC2 --> APIGW[API Gateway]
	APIGW --> L[Lambda Fraud Check]
	EC2 --> CW[CloudWatch]
	L --> CW
	RDS --> CW
	IAM[IAM Roles] -. controls access .-> EC2
	IAM -. controls access .-> L
	VPC[VPC Boundary] -. network isolation .-> ELB
	VPC -. network isolation .-> EC2
	VPC -. network isolation .-> RDS
```

### 2) Payment Processing Sequence

```mermaid
sequenceDiagram
	actor User
	participant UI as CloudCanvas or SecurePay UI
	participant ALB as ELB
	participant API as Spring Boot on EC2
	participant FRAUD as API Gateway + Lambda
	participant DB as RDS
	participant OBJ as S3

	User->>UI: Initiate payment
	UI->>ALB: POST payment request
	ALB->>API: Route request
	API->>FRAUD: Fraud check call
	FRAUD-->>API: Approve or deny

	alt Approved
		API->>DB: Commit transaction
		API->>OBJ: Upload receipt
		API-->>UI: Success response
	else Denied
		API-->>UI: Block response
	end
```

### 3) Architecture Canvas State

```mermaid
stateDiagram-v2
	[*] --> Empty
	Empty --> Building: placeService(id)
	Building --> Building: placeService(next)
	Building --> Selected: selectService(id)
	Selected --> Selected: setActiveTab(what or why or how)
	Selected --> Building: selectService(other)
	Building --> Complete: all 10 placed
	Complete --> Selected: selectService(id)
```

### 4) Deployment Topology

```mermaid
flowchart TB
	subgraph Frontend
	  VERCEL[Vercel or static host]
	end

	subgraph AWS
	  CF2[CloudFront]
	  ELB2[ELB]
	  EC22[EC2]
	  RDS2[(RDS)]
	  S32[(S3)]
	  AP2[API Gateway]
	  L2[Lambda]
	  CW2[CloudWatch]
	end

	VERCEL --> CF2
	CF2 --> ELB2 --> EC22
	EC22 --> RDS2
	EC22 --> S32
	EC22 --> AP2 --> L2
	EC22 --> CW2
	L2 --> CW2
```

## Professional Repository Notes

- Credentials are not stored in source files.
- Environment files are ignored via gitignore.
- Build artifacts and local runtime folders are excluded from git.
- Keep production secrets only in platform-managed environment variables.

## Roadmap

- Add real evidence screenshots in public and map them to src/data/evidence.ts
- Wire permanent live demo and GitHub links in UI actions
- Add CI workflow for linting, type checks, and build

## Author

Rishi Raj