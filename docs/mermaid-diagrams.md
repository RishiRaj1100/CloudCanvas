# CloudCanvas Mermaid Diagrams

This document provides Mermaid definitions for the major technical views in the project.
You can render these in Mermaid-compatible viewers.

## 1) System Architecture

```mermaid
flowchart LR
    U[User Browser] --> CF[CloudFront]
    CF --> ELB[Elastic Load Balancer]
    ELB --> EC2[EC2 / Spring Boot APIs]
    EC2 --> RDS[(RDS PostgreSQL)]
    EC2 --> S3[(S3 Receipts)]
    EC2 --> APIGW[API Gateway]
    APIGW --> L[Lambda Fraud Check]
    EC2 --> CW[CloudWatch]
    L --> CW
    RDS --> CW
    IAM[IAM Roles & Policies] -. secures .-> EC2
    IAM -. secures .-> L
    VPC[VPC Network Boundary] -. contains .-> ELB
    VPC -. contains .-> EC2
    VPC -. contains .-> RDS
```

## 2) Payment Request Sequence

```mermaid
sequenceDiagram
    actor User
    participant UI as CloudCanvas / SecurePay UI
    participant ALB as ELB
    participant API as Spring Boot on EC2
    participant FRAUD as API Gateway + Lambda
    participant DB as RDS PostgreSQL
    participant OBJ as S3

    User->>UI: Initiate transfer (amount, recipient)
    UI->>ALB: POST /payments/send
    ALB->>API: Forward request
    API->>FRAUD: Fraud score request
    FRAUD-->>API: APPROVE / DENY + score

    alt Approved
        API->>DB: Begin transaction + debit/credit
        DB-->>API: Commit successful
        API->>OBJ: Upload receipt PDF
        API-->>UI: Payment success + receipt reference
    else Denied
        API-->>UI: Payment blocked (risk threshold)
    end
```

## 3) CloudCanvas UI Section Map

```mermaid
flowchart TD
    P[app/page.tsx]
    P --> NAV[NavBar]
    P --> OP[CinematicOpener]
    P --> AC[ArchitectureCanvas]
    P --> LJ[LivePaymentJourney]
    P --> EW[EvidenceWall / EvidenceGallery]
    P --> CR[CostReveal]
    P --> DF[DeveloperFooter]

    AC --> DS[src/data/services.ts]
    LJ --> DD[src/data/demoSteps.ts]
    EW --> DE[src/data/evidence.ts]
    AC --> HC[src/hooks/useArchitectureCanvas.ts]
    LJ --> HD[src/hooks/useDemoPlayer.ts]
```

## 4) Canvas State Machine

```mermaid
stateDiagram-v2
    [*] --> Empty
    Empty --> Building: placeService(id)
    Building --> Building: placeService(nextId)
    Building --> Selected: selectService(id)
    Selected --> Selected: setActiveTab(what/why/how)
    Selected --> Building: selectService(otherId)
    Building --> Complete: all 10 services placed
    Complete --> Selected: selectService(id)
```

## 5) Deployment Topology

```mermaid
flowchart TB
    subgraph Frontend Hosting
        V[Vercel / Static Hosting]
    end

    subgraph Cloud Runtime
        CF2[CloudFront]
        ELB2[ELB]
        EC22[EC2 Spring Boot]
        RDS2[(RDS)]
        S32[(S3)]
        AP2[API Gateway]
        L2[Lambda]
        CW2[CloudWatch]
    end

    V --> CF2
    CF2 --> ELB2 --> EC22
    EC22 --> RDS2
    EC22 --> S32
    EC22 --> AP2 --> L2
    EC22 --> CW2
    L2 --> CW2
```

## 6) Evidence Collection Workflow

```mermaid
flowchart LR
    A[Deploy / Run AWS Session] --> B[Capture Console Screenshots]
    B --> C[Store in public/evidence]
    C --> D[Map in src/data/evidence.ts]
    D --> E[Render Evidence Section]
    E --> F[Review labels, descriptions, ordering]
```
