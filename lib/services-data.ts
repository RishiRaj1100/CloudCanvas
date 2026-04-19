import { 
  Cloud, 
  Shield, 
  Server, 
  Database, 
  FolderOpen, 
  Zap, 
  Globe, 
  Split, 
  Activity,
  Network
} from 'lucide-react'

export interface ServiceData {
  id: string
  name: string
  shortName: string
  icon: typeof Cloud
  color: string
  glowClass: string
  position: { x: number; y: number }
  what: string
  why: string
  code: string
  connections: string[]
}

export const SERVICES: ServiceData[] = [
  {
    id: 'vpc',
    name: 'Amazon VPC',
    shortName: 'VPC',
    icon: Network,
    color: '#8B5CF6',
    glowClass: 'glow-purple',
    position: { x: 50, y: 50 },
    what: `Think of VPC as your own private data center inside AWS. It's an invisible wall that separates your infrastructure from everyone else's. Inside this wall, you control everything — who can enter, who can talk to whom, and which doors lead outside.`,
    why: `SecurePay handles real money. Every rupee that moves needs to be protected. The VPC creates two zones: a public area where the internet can reach your load balancer, and a private area where your database lives — completely invisible to the outside world. No hacker can even see the database exists.`,
    code: `// VPC Configuration
resource "aws_vpc" "securepay" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "securepay-vpc"
  }
}

// Public Subnet (for ALB, EC2)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.securepay.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true
}

// Private Subnet (for RDS)
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.securepay.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-south-1a"
}`,
    connections: []
  },
  {
    id: 'iam',
    name: 'AWS IAM',
    shortName: 'IAM',
    icon: Shield,
    color: '#EF4444',
    glowClass: 'glow-red',
    position: { x: 50, y: 15 },
    what: `IAM is the security guard of AWS. It decides who can do what. Instead of sharing passwords, you create roles — like job descriptions that say "this EC2 server can read from S3 and write to CloudWatch, but nothing else." Zero hardcoded credentials, ever.`,
    why: `The SecurePay EC2 server needs to store receipt PDFs in S3, call Lambda for fraud checks, and send metrics to CloudWatch. Instead of storing AWS keys in the code (dangerous!), we attach an IAM role to the server. The server automatically gets temporary credentials. If the server is compromised, the attacker can only do what the role allows — not destroy everything.`,
    code: `// IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "securepay-ec2-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

// Attach permissions
resource "aws_iam_role_policy_attachment" "s3" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role_policy_attachment" "lambda" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSLambda_FullAccess"
}`,
    connections: ['vpc']
  },
  {
    id: 'ec2',
    name: 'Amazon EC2',
    shortName: 'EC2',
    icon: Server,
    color: '#F59E0B',
    glowClass: 'glow-amber',
    position: { x: 50, y: 50 },
    what: `This is the actual computer running your code. When you push to GitHub and deploy, your Spring Boot application ends up running on this machine — sitting in Amazon's Mumbai data center, always online, constantly watching for payment requests.`,
    why: `SecurePay's entire backend runs here. Four Spring Boot microservices — auth, payment, merchant, and gateway — all running as JAR files on this single t2.micro instance. Every API call, every wallet update, every transaction validation happens inside this box. It's the heart of the system.`,
    code: `// EC2 Instance Configuration
resource "aws_instance" "backend" {
  ami                    = "ami-0c55b159cbfafe1f0"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name
  
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y java-17-amazon-corretto
    
    # Start Spring Boot services
    java -jar /opt/securepay/auth-service.jar &
    java -jar /opt/securepay/payment-service.jar &
    java -jar /opt/securepay/merchant-service.jar &
    java -jar /opt/securepay/gateway-service.jar &
  EOF
  
  tags = {
    Name = "securepay-backend"
  }
}`,
    connections: ['vpc', 'iam']
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    shortName: 'RDS',
    icon: Database,
    color: '#3B82F6',
    glowClass: 'glow-blue',
    position: { x: 25, y: 70 },
    what: `RDS is a managed PostgreSQL database. Amazon handles the backups, the security patches, the replication. You just use it like any database. The "managed" part is the magic — you never SSH into it, never worry about disk space, never wake up at 3am because the database crashed.`,
    why: `Every user account, every wallet balance, every transaction record lives here. When Priya sends ₹500 to Rahul, this database atomically debits her wallet and credits his — in a single transaction. If anything fails, both operations reverse. No money is ever lost or created from nothing.`,
    code: `// RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier             = "securepay-db"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t2.micro"
  allocated_storage      = 20
  
  db_name                = "securepay"
  username               = "admin"
  password               = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  # Private subnet only - no public access
  publicly_accessible    = false
  skip_final_snapshot    = true
  
  tags = {
    Name = "securepay-database"
  }
}

// Security: Only EC2 can connect
resource "aws_security_group" "rds" {
  vpc_id = aws_vpc.securepay.id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }
}`,
    connections: ['ec2']
  },
  {
    id: 's3',
    name: 'Amazon S3',
    shortName: 'S3',
    icon: FolderOpen,
    color: '#22C55E',
    glowClass: 'glow-green',
    position: { x: 75, y: 70 },
    what: `S3 is infinite storage that never fails. You put files in, they stay there forever (or until you delete them). No servers to manage, no disks to monitor. It can store 1 file or 1 trillion files — same code, same simplicity. Every object gets a unique URL.`,
    why: `Two S3 buckets power SecurePay. The first stores receipt PDFs — every successful payment generates a receipt that customers can download anytime. The second hosts the React frontend — the entire web app is just static files served from S3 through CloudFront. Infinitely scalable, costs almost nothing.`,
    code: `// S3 Bucket for Receipts
resource "aws_s3_bucket" "receipts" {
  bucket = "securepay-receipts"
}

// S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "securepay-frontend"
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "index.html"
  }
}

// Spring Boot: Store receipt
@Service
public class ReceiptService {
    private final S3Client s3Client;
    
    public String storeReceipt(Transaction tx) {
        byte[] pdf = generatePdf(tx);
        String key = "receipts/" + tx.getId() + ".pdf";
        
        s3Client.putObject(
            PutObjectRequest.builder()
                .bucket("securepay-receipts")
                .key(key)
                .contentType("application/pdf")
                .build(),
            RequestBody.fromBytes(pdf)
        );
        
        return key;
    }
}`,
    connections: ['ec2']
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    shortName: 'Lambda',
    icon: Zap,
    color: '#F59E0B',
    glowClass: 'glow-amber',
    position: { x: 75, y: 35 },
    what: `Lambda runs code without servers. You upload a function, and AWS runs it whenever needed — 1 time or 1 million times. You pay only when it runs, down to the millisecond. No servers to manage, no capacity to plan. It just works.`,
    why: `Every single rupee that moves through SecurePay is silently checked here first. The fraud detection function analyzes the transaction — amount, frequency, user history, time of day — and returns APPROVE or DENY in milliseconds. It costs nothing when idle and scales to any load automatically. This is how a solo developer can have enterprise-grade fraud detection.`,
    code: `// Lambda Fraud Detection Function
import json

def lambda_handler(event, context):
    body = json.loads(event['body'])
    
    amount = body['amount']
    user_id = body['userId']
    txn_count_24h = body['transactionCount24h']
    
    # Risk scoring
    risk_score = 0
    
    if amount > 50000:
        risk_score += 40
    if txn_count_24h > 10:
        risk_score += 30
    if amount > 10000 and txn_count_24h > 5:
        risk_score += 20
    
    status = "DENY" if risk_score > 70 else "APPROVE"
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'status': status,
            'riskScore': risk_score,
            'reason': 'High risk' if status == 'DENY' else 'Low risk'
        })
    }`,
    connections: ['ec2']
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    shortName: 'API GW',
    icon: Globe,
    color: '#6366F1',
    glowClass: 'glow-indigo',
    position: { x: 75, y: 15 },
    what: `API Gateway is the front door to your Lambda functions. It takes HTTP requests from the internet, validates them, and routes them to the right Lambda. It handles rate limiting, authentication, and CORS — all the boring but critical stuff.`,
    why: `The fraud detection Lambda needs a public URL so the Spring Boot backend can call it. API Gateway exposes POST /fraud-check as a REST endpoint. Every fraud check from EC2 comes through here. It also protects Lambda from abuse — you can set rate limits and require API keys.`,
    code: `// API Gateway REST API
resource "aws_apigatewayv2_api" "fraud" {
  name          = "securepay-fraud-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id             = aws_apigatewayv2_api.fraud.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.fraud.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "fraud_check" {
  api_id    = aws_apigatewayv2_api.fraud.id
  route_key = "POST /fraud-check"
  target    = "integrations/\${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.fraud.id
  name        = "prod"
  auto_deploy = true
}

// Output: https://xxx.execute-api.ap-south-1.amazonaws.com/prod/fraud-check`,
    connections: ['lambda']
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    shortName: 'CloudFront',
    icon: Cloud,
    color: '#14B8A6',
    glowClass: 'glow-teal',
    position: { x: 25, y: 15 },
    what: `CloudFront is a Content Delivery Network (CDN). It copies your content to 400+ locations worldwide. When someone in Mumbai opens your website, they get it from Mumbai — not from a server in Virginia. Faster loading, lower latency, happier users.`,
    why: `The React frontend is served through CloudFront. Every user in India gets the app from an edge location near them. First load is fast. Subsequent loads are instant (cached). CloudFront also provides free HTTPS — your site is secure without buying certificates. All this costs almost nothing on the free tier.`,
    code: `// CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-securepay-frontend"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }
  
  enabled             = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-securepay-frontend"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }
  
  price_class = "PriceClass_200"
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

// Output: https://d1234abcd.cloudfront.net`,
    connections: []
  },
  {
    id: 'elb',
    name: 'Elastic Load Balancer',
    shortName: 'ELB',
    icon: Split,
    color: '#6366F1',
    glowClass: 'glow-indigo',
    position: { x: 25, y: 35 },
    what: `A Load Balancer sits between the internet and your servers. All traffic hits the load balancer first, and it decides which server handles each request. If one server is busy, it routes to another. If a server dies, it stops sending traffic there. Your app stays online even when things break.`,
    why: `Every API request to SecurePay goes through this load balancer. Right now we have one EC2 instance — but when traffic grows, Auto Scaling adds more instances automatically. The load balancer distributes requests across all healthy instances. Zero downtime deployments become possible: spin up new server, add to load balancer, remove old server.`,
    code: `// Application Load Balancer
resource "aws_lb" "main" {
  name               = "securepay-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public.id, aws_subnet.public_2.id]
}

resource "aws_lb_target_group" "backend" {
  name     = "securepay-backend-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.securepay.id
  
  health_check {
    path                = "/actuator/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}`,
    connections: ['cloudfront', 'ec2']
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch',
    shortName: 'CloudWatch',
    icon: Activity,
    color: '#EC4899',
    glowClass: 'glow-pink',
    position: { x: 50, y: 85 },
    what: `CloudWatch is AWS's monitoring service. It collects metrics from every service — CPU usage, request counts, error rates, custom metrics you define. It stores logs, creates dashboards, sends alerts. When something breaks at 3am, CloudWatch tells you what happened.`,
    why: `SecurePay sends custom metrics to CloudWatch: payment.transfer.success, payment.transfer.failed, fraud.check.deny. A live dashboard shows system health in real-time. A billing alarm triggers if AWS costs exceed $1 (they never do). Spring Boot Micrometer automatically exports JVM metrics. Full observability, zero infrastructure to manage.`,
    code: `// CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "SecurePay"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["SecurePay", "payment.transfer.success"],
            ["SecurePay", "payment.transfer.failed"],
            ["SecurePay", "fraud.check.deny"]
          ]
          title = "Payment Metrics"
          region = "ap-south-1"
        }
      }
    ]
  })
}

// Billing Alarm - Alert if cost > $1
resource "aws_cloudwatch_metric_alarm" "billing" {
  alarm_name          = "securepay-billing-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = 86400
  statistic           = "Maximum"
  threshold           = 1
  alarm_actions       = [aws_sns_topic.alerts.arn]
}`,
    connections: ['ec2', 'lambda', 'rds']
  }
]

// Connection paths for the architecture diagram
export const SERVICE_CONNECTIONS = [
  { from: 'cloudfront', to: 'elb' },
  { from: 'elb', to: 'ec2' },
  { from: 'ec2', to: 'rds' },
  { from: 'ec2', to: 's3' },
  { from: 'ec2', to: 'lambda' },
  { from: 'lambda', to: 'api-gateway' },
  { from: 'cloudwatch', to: 'ec2' },
  { from: 'cloudwatch', to: 'lambda' },
  { from: 'cloudwatch', to: 'rds' },
]
