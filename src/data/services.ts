export interface AWSService {
  id: string
  name: string
  shortName: string
  color: string
  category:
    | 'network'
    | 'compute'
    | 'storage'
    | 'database'
    | 'serverless'
    | 'cdn'
    | 'monitoring'
    | 'security'
  canvasPosition: { x: number; y: number }
  connectsTo: string[]
  what: string
  why: string
  how: string
  awsConsoleSteps: string[]
  freeLimit: string
  screenshotLabel: string
}

export const awsServices: AWSService[] = [
  {
    id: 'vpc',
    name: 'Amazon VPC',
    shortName: 'VPC',
    color: '#0EA5E9',
    category: 'network',
    canvasPosition: { x: 50, y: 90 },
    connectsTo: ['elb', 'ec2', 'rds'],
    what:
      'A logically isolated network boundary for SecurePay resources, with public and private subnets, route tables, and network ACLs.',
    why:
      'VPC keeps the database and internal app traffic private while still exposing only the load balancer to the internet.',
    how: `# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://securepay-rds.cluster-xyz.ap-south-1.rds.amazonaws.com:5432/securepay
    username: \\${DB_USERNAME}
    password: \\${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate

server:
  address: 0.0.0.0
  port: 8080`,
    awsConsoleSteps: [
      'Open VPC Console -> Create VPC with CIDR 10.0.0.0/16.',
      'Create 2 public subnets and 2 private subnets across AZs.',
      'Attach Internet Gateway, and create NAT Gateway for private subnet egress.',
      'Associate route tables so only public subnets have direct internet routes.'
    ],
    freeLimit: 'No always-free VPC charge; pay only for extras like NAT Gateway and data transfer.',
    screenshotLabel: 'VPC with public/private subnet map'
  },
  {
    id: 'iam',
    name: 'AWS Identity and Access Management',
    shortName: 'IAM',
    color: '#EF4444',
    category: 'security',
    canvasPosition: { x: 50, y: 10 },
    connectsTo: ['ec2', 'lambda', 's3', 'cloudwatch'],
    what:
      'IAM defines who can access AWS resources and what actions are allowed using users, roles, and policies.',
    why:
      'SecurePay avoids hardcoded credentials by attaching least-privilege roles to EC2 and Lambda.',
    how: `@Configuration
public class AwsClientConfig {

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
}

// Uses IAM role credentials from EC2/Lambda runtime automatically`,
    awsConsoleSteps: [
      'Open IAM Console -> Roles -> Create role for EC2.',
      'Attach policies: AmazonS3ReadOnlyAccess and CloudWatchAgentServerPolicy (or custom least-privilege policy).',
      'Create Lambda execution role with CloudWatch Logs and required downstream permissions.',
      'Attach roles to EC2 instance profile and Lambda function.'
    ],
    freeLimit: 'IAM users, groups, roles, and policies are free; billed services still apply.',
    screenshotLabel: 'IAM roles attached to EC2 and Lambda'
  },
  {
    id: 'ec2',
    name: 'Amazon EC2',
    shortName: 'EC2',
    color: '#F59E0B',
    category: 'compute',
    canvasPosition: { x: 50, y: 50 },
    connectsTo: ['rds', 's3', 'lambda', 'cloudwatch'],
    what:
      'Resizable virtual server running SecurePay Spring Boot services (gateway, payment, merchant, auth).',
    why:
      'EC2 hosts the API runtime with full control over Java version, JVM flags, and deployment strategy.',
    how: `@SpringBootApplication
@EnableDiscoveryClient
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/send")
    public ResponseEntity<PaymentResponse> send(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }
}`,
    awsConsoleSteps: [
      'Open EC2 Console -> Launch instance (Amazon Linux 2023, t2.micro for demo).',
      'Configure security group to allow 8080 only from ELB security group.',
      'Attach IAM instance profile and add user-data/bootstrap for Java app startup.',
      'Deploy JAR and verify health endpoint from private network path.'
    ],
    freeLimit: '750 hours/month of t2.micro or t3.micro for 12 months (new account).',
    screenshotLabel: 'EC2 instance details with security group'
  },
  {
    id: 'rds',
    name: 'Amazon RDS (PostgreSQL)',
    shortName: 'RDS',
    color: '#3B82F6',
    category: 'database',
    canvasPosition: { x: 25, y: 75 },
    connectsTo: ['ec2', 'cloudwatch'],
    what:
      'Managed PostgreSQL database for users, wallets, transactions, and ledger-safe payment state.',
    why:
      'RDS gives managed backups, patching, monitoring, and automated failover options without self-hosting Postgres.',
    how: `@Entity
@Table(name = "transactions")
@Getter
@Setter
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String senderUpi;

    @Column(nullable = false)
    private String receiverUpi;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
}

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {}`,
    awsConsoleSteps: [
      'Open RDS Console -> Create database -> PostgreSQL (Free Tier template if eligible).',
      'Select private subnets and disable public access.',
      'Allow inbound 5432 only from EC2 application security group.',
      'Copy endpoint and update Spring datasource URL in production config.'
    ],
    freeLimit: '750 hours/month of db.t3.micro + 20 GB storage for 12 months (new account).',
    screenshotLabel: 'RDS PostgreSQL endpoint and connectivity'
  },
  {
    id: 's3',
    name: 'Amazon S3',
    shortName: 'S3',
    color: '#22C55E',
    category: 'storage',
    canvasPosition: { x: 75, y: 75 },
    connectsTo: ['ec2', 'cloudfront', 'iam'],
    what:
      'Object storage for receipt PDFs, build artifacts, and optionally static frontend hosting.',
    why:
      'SecurePay persists generated receipts durably and serves static assets cheaply at scale.',
    how: `@Service
@RequiredArgsConstructor
public class ReceiptStorageService {

    private final S3Client s3Client;

    @Value("\\${app.aws.receipt-bucket}")
    private String receiptBucket;

    public String uploadReceipt(String key, byte[] content) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(receiptBucket)
                .key(key)
                .contentType("application/pdf")
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(content));
        return key;
    }
}`,
    awsConsoleSteps: [
      'Open S3 Console -> Create bucket with globally unique name.',
      'Disable public ACLs for receipt bucket; keep Block Public Access enabled.',
      'Create folder prefix policy (receipts/) and lifecycle retention rule.',
      'Grant write/read permissions via IAM role instead of access keys.'
    ],
    freeLimit: '5 GB Standard storage + 20,000 GET and 2,000 PUT requests/month for 12 months.',
    screenshotLabel: 'S3 bucket objects and lifecycle rules'
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    shortName: 'Lambda',
    color: '#F97316',
    category: 'serverless',
    canvasPosition: { x: 75, y: 34 },
    connectsTo: ['api-gateway', 'cloudwatch', 'iam'],
    what:
      'Event-driven serverless compute for fraud scoring and async payment side tasks.',
    why:
      'Lambda scales instantly for variable payment bursts and costs only per invocation.',
    how: `exports.handler = async (event) => {
  const payload = typeof event.body === 'string' ? JSON.parse(event.body) : event;

  const amount = Number(payload.amount ?? 0);
  const recentTxCount = Number(payload.recentTxCount ?? 0);
  const deviceRisk = Number(payload.deviceRisk ?? 0);

  let riskScore = 0;
  if (amount > 50000) riskScore += 45;
  if (recentTxCount > 8) riskScore += 30;
  if (deviceRisk > 70) riskScore += 25;

  const decision = riskScore >= 70 ? 'DENY' : 'APPROVE';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, riskScore })
  };
};`,
    awsConsoleSteps: [
      'Open Lambda Console -> Create function (Node.js runtime).',
      'Paste fraud-check handler and deploy the latest code.',
      'Set timeout/memory and environment variables for thresholds.',
      'Assign execution role with CloudWatch Logs permissions.'
    ],
    freeLimit: '1M requests/month + 400,000 GB-seconds compute per month always free.',
    screenshotLabel: 'Lambda function code and test event result'
  },
  {
    id: 'api-gateway',
    name: 'Amazon API Gateway',
    shortName: 'API Gateway',
    color: '#6366F1',
    category: 'serverless',
    canvasPosition: { x: 75, y: 12 },
    connectsTo: ['lambda', 'ec2', 'cloudwatch'],
    what:
      'Managed API front door that routes HTTP calls to Lambda with auth, throttling, and request mapping.',
    why:
      'SecurePay exposes a clean fraud-check endpoint while protecting Lambda from direct public access.',
    how: `@Service
@RequiredArgsConstructor
public class FraudCheckClient {

    private final WebClient webClient = WebClient.builder().build();

    @Value("\\${app.fraud.api-url}")
    private String fraudApiUrl;

    public Mono<FraudDecision> evaluate(PaymentRequest request) {
        return webClient.post()
                .uri(fraudApiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(FraudDecision.class);
    }
}`,
    awsConsoleSteps: [
      'Open API Gateway Console -> Create HTTP API.',
      'Add route POST /fraud-check and integrate with Lambda function.',
      'Enable CORS only if needed and deploy to default stage.',
      'Copy invoke URL and set app.fraud.api-url in Spring Boot config.'
    ],
    freeLimit: '1M REST API calls/month for 12 months (new account).',
    screenshotLabel: 'API Gateway route integration to Lambda'
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    shortName: 'CloudFront',
    color: '#A855F7',
    category: 'cdn',
    canvasPosition: { x: 20, y: 12 },
    connectsTo: ['s3', 'elb'],
    what:
      'Global CDN that caches frontend/static assets and can front dynamic origins with edge acceleration.',
    why:
      'SecurePay loads fast from global edge locations and reduces origin traffic/cost.',
    how: `// frontend/.env.production
NEXT_PUBLIC_API_BASE=https://api.securepay.example.com

// next.config.mjs
export default {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
}

// CloudFront origin can point to S3 static site bucket for frontend build artifacts`,
    awsConsoleSteps: [
      'Open CloudFront Console -> Create distribution.',
      'Set origin to S3 bucket (frontend) or ALB for dynamic APIs.',
      'Configure default root object as index.html and set cache policy.',
      'Add custom domain and ACM certificate if using production DNS.'
    ],
    freeLimit: '1 TB data transfer out + 10M HTTP/HTTPS requests/month for 12 months (new account).',
    screenshotLabel: 'CloudFront distribution behaviors and cache'
  },
  {
    id: 'elb',
    name: 'Elastic Load Balancing (ALB)',
    shortName: 'ELB',
    color: '#14B8A6',
    category: 'network',
    canvasPosition: { x: 20, y: 32 },
    connectsTo: ['ec2', 'cloudwatch', 'vpc'],
    what:
      'Application Load Balancer distributes incoming traffic across one or more EC2 targets.',
    why:
      'ELB improves availability and gives path-based routing and health checks for SecurePay services.',
    how: `@RestController
@RequestMapping("/actuator")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "payment-service");
    }
}

// ALB target group health check path: /actuator/health`,
    awsConsoleSteps: [
      'Open EC2 Console -> Load Balancers -> Create Application Load Balancer.',
      'Choose public subnets and attach ALB security group (80/443 inbound).',
      'Create target group for EC2 instances and configure /actuator/health check.',
      'Add listener rules and forward traffic to the target group.'
    ],
    freeLimit: '750 hours/month shared between ALB and CLB for 12 months (new account).',
    screenshotLabel: 'ALB listeners, target group health, and rules'
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch',
    shortName: 'CloudWatch',
    color: '#EAB308',
    category: 'monitoring',
    canvasPosition: { x: 50, y: 82 },
    connectsTo: ['ec2', 'lambda', 'rds', 'elb', 'api-gateway'],
    what:
      'Observability stack for metrics, logs, dashboards, alarms, and event-driven notifications.',
    why:
      'SecurePay needs real-time visibility into latency, errors, failed transactions, and fraud spikes.',
    how: `logging:
  level:
    root: INFO
    com.securepay: DEBUG

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always

// CloudWatch Agent/Logs streams application logs from EC2 instance`,
    awsConsoleSteps: [
      'Open CloudWatch Console -> Logs -> Create log groups for app and Lambda.',
      'Create dashboard with ALB 5XX, EC2 CPU, Lambda errors, RDS connections.',
      'Create alarm for payment error rate threshold and notify via SNS.',
      'Enable retention policy and metric filters for critical error patterns.'
    ],
    freeLimit: 'Free tier includes limited metrics, alarms, logs ingestion, and dashboard usage.',
    screenshotLabel: 'CloudWatch dashboard with payment KPIs'
  }
]

export const awsServiceMap = new Map(awsServices.map((service) => [service.id, service]))
