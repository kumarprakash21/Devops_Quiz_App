const q = (question, correct, distractors, explanation) => ({ question, correct, distractors, explanation });

const rawQuestionSections = [
  {
    title: "Manage Azure identities and governance",
    shortTitle: "Identity & Governance",
    description: "Microsoft Entra ID, RBAC, subscriptions, Policy, and resource governance.",
    questions: [
      q("You need to let a user manage virtual machines in one resource group without granting access elsewhere. What should you do?", "Assign Virtual Machine Contributor at the resource group scope", ["Assign Global Administrator at tenant scope", "Assign Owner at subscription scope", "Create a management group"], "An RBAC assignment at resource-group scope limits the role to resources in that group."),
      q("Which service can prevent resources from being deployed in unapproved Azure regions?", "Azure Policy", ["Azure Advisor", "Microsoft Defender for Cloud", "Network Watcher"], "Azure Policy evaluates resource properties and can deny deployments that violate location rules."),
      q("Which resource lock permits reads but prevents both changes and deletion?", "ReadOnly", ["CanNotDelete", "DenyAction", "Immutable"], "ReadOnly blocks update and delete operations; CanNotDelete permits updates."),
      q("At which scope should a policy apply when it must govern several subscriptions?", "Management group", ["Resource", "Resource group", "Individual subscription only"], "Management groups provide a governance scope above subscriptions."),
      q("What is the recommended way to give an application an Azure identity without storing credentials?", "Managed identity", ["Shared access signature", "Guest account", "Access key"], "A managed identity lets Azure resources authenticate without application-managed secrets."),
      q("Which Microsoft Entra feature requires extra verification when sign-in risk is high?", "Conditional Access", ["Administrative units", "Access reviews", "Self-service password reset"], "Conditional Access policies make access decisions using signals such as sign-in risk."),
      q("Which Azure RBAC role can manage all resources but cannot assign Azure roles?", "Contributor", ["Owner", "User Access Administrator", "Reader"], "Contributor manages resources but cannot grant access through role assignments."),
      q("A user from a partner organization needs access to your tenant. What should you create?", "A Microsoft Entra B2B guest user", ["A managed identity", "A device identity", "A local VM account"], "B2B collaboration represents an external user as a guest in your tenant."),
      q("Which feature groups related Azure Policy definitions into one assignment?", "An initiative", ["A blueprint lock", "An action group", "A management lock"], "An initiative is a collection of policy definitions managed and assigned together."),
      q("What happens to a tag applied to a resource group by default?", "It is not automatically inherited by resources", ["It is inherited by every resource", "It becomes immutable", "It is copied only to virtual machines"], "Tags do not inherit automatically; a policy can append or inherit them."),
      q("Which role allows a user to view resources but not change them?", "Reader", ["Contributor", "Owner", "Resource Policy Contributor"], "Reader provides view access to resources without modification rights."),
      q("You must prevent accidental deletion of a resource while still allowing configuration changes. Which lock should you apply?", "CanNotDelete", ["ReadOnly", "Owner", "DenyAssignment"], "A CanNotDelete lock permits authorized updates but blocks deletion."),
      q("Which hierarchy correctly orders Azure governance scopes from broadest to narrowest?", "Management group, subscription, resource group, resource", ["Subscription, management group, resource, resource group", "Resource group, subscription, management group, resource", "Tenant, resource, subscription, resource group"], "Management groups contain subscriptions, which contain resource groups and resources."),
      q("Which Microsoft Entra object should represent an automated workload running outside Azure?", "Service principal", ["Security group only", "Guest user", "Administrative unit"], "A service principal is an application identity used by services and automation."),
      q("Where can you review recommendations for reducing underused Azure resource costs?", "Azure Advisor", ["Azure Policy compliance", "Microsoft Entra audit logs", "Network Watcher"], "Azure Advisor provides personalized cost, reliability, security, and performance recommendations."),
      q("A role assignment should be inherited by every resource in one subscription. Where should it be assigned?", "At the subscription scope", ["At each resource separately", "At the tenant root only", "At one resource group"], "Assignments at subscription scope flow down to its resource groups and resources."),
      q("Which Microsoft Entra feature can automatically add users to a group based on user attributes?", "Dynamic membership rules", ["Resource locks", "Access packages", "Service endpoints"], "Dynamic groups evaluate rules based on properties such as department."),
      q("What can you use to organize Azure costs by department across different resource types?", "Tags", ["Availability zones", "NSG rules", "Private endpoints"], "Consistent tags allow cost data to be grouped by business metadata."),
      q("You need to move a supported resource to another resource group in the same subscription. What happens to its resource ID?", "The resource ID changes", ["The resource ID remains identical", "The subscription ID changes", "The resource is recreated automatically"], "The resource-group segment is part of the resource ID, so it changes after a move."),
      q("Which role is designed to manage user access to Azure resources without managing the resources themselves?", "User Access Administrator", ["Reader", "Contributor", "Virtual Machine Administrator Login"], "User Access Administrator can manage role assignments and user access."),
    ]
  },
  {
    title: "Implement and manage storage",
    shortTitle: "Storage",
    description: "Storage accounts, Azure Files, Blob Storage, security, and data lifecycle.",
    questions: [
      q("Data must remain readable from a secondary region if the primary region fails. Which redundancy option should you choose?", "RA-GRS", ["LRS", "ZRS", "GRS"], "RA-GRS provides geo-replication plus a readable secondary endpoint."),
      q("How should you grant temporary, restricted access to one blob without sharing an account key?", "Use a shared access signature", ["Use a resource lock", "Use an NSG", "Use an Azure Policy exemption"], "A SAS delegates time-limited, permission-scoped access to storage data."),
      q("Which Blob Storage tier is designed for rarely accessed data that can tolerate hours of retrieval delay?", "Archive", ["Hot", "Cool", "Premium"], "Archive data must be rehydrated before it can be read."),
      q("Which protocol can Azure Files use for Windows-compatible file shares?", "SMB", ["RDP", "SMTP", "SNMP"], "Azure Files supports SMB shares and also supports NFS in eligible configurations."),
      q("Which tool can synchronize an on-premises Windows Server file share with Azure Files?", "Azure File Sync", ["AzCopy", "Azure Data Box Gateway only", "Storage Explorer"], "Azure File Sync caches Azure file shares on Windows Server endpoints."),
      q("What should you enable to recover a blob that a user accidentally deletes?", "Blob soft delete", ["Static website hosting", "Change feed only", "Object replication"], "Soft delete retains deleted blobs for a configured retention period."),
      q("Which authorization method is recommended for Blob Storage when users have Microsoft Entra identities?", "Azure RBAC with Microsoft Entra ID", ["Storage account keys", "Anonymous public access", "A hard-coded SAS"], "Microsoft Entra authorization avoids shared keys and supports least-privilege RBAC."),
      q("Which storage service is optimized for massive amounts of unstructured object data?", "Azure Blob Storage", ["Azure Queue Storage", "Azure Table Storage", "Azure Files only"], "Blob Storage is Azure's object store for text and binary data."),
      q("You need to copy many files to Azure Storage from a command line. Which utility should you use?", "AzCopy", ["Kusto Explorer", "Network Watcher", "Azure Migrate appliance"], "AzCopy is a command-line utility optimized for copying data to and from Azure Storage."),
      q("What does a storage account firewall control?", "Network access to the storage account", ["Blob retention periods", "RBAC inheritance", "File naming conventions"], "Storage firewall rules restrict requests by network, subnet, or IP."),
      q("Which feature moves blobs to cooler tiers or deletes them based on age?", "Lifecycle management", ["Object replication", "Versioning", "Inventory reports"], "Lifecycle rules transition or expire blobs when their conditions are met."),
      q("You need private access to a storage account from a VNet using a private IP. What should you create?", "A private endpoint", ["A public IP prefix", "A NAT gateway", "A load balancer rule"], "A private endpoint maps the service into a VNet through a private IP address."),
      q("Which redundancy option synchronously copies data across availability zones in one region?", "ZRS", ["LRS", "GRS", "RA-GRS"], "Zone-redundant storage maintains synchronous copies across availability zones."),
      q("Which setting makes a blob immutable for a defined retention period?", "A time-based retention policy", ["A routing preference", "A CORS rule", "A lifecycle transition"], "Immutable storage retention policies prevent modification and deletion for the set period."),
      q("Which storage account performance tier is required for premium file shares?", "Premium", ["Standard only", "Archive", "Cool"], "Premium file shares use SSD-backed storage for consistent high performance."),
      q("What does blob versioning create when an existing blob is modified?", "A previous version of the blob", ["A new storage account", "A file share snapshot", "A new container"], "Versioning automatically preserves earlier blob versions after writes or deletes."),
      q("Which service provides a graphical desktop interface for managing Azure Storage data?", "Azure Storage Explorer", ["Azure Advisor", "Azure Monitor Metrics", "Cloud Shell only"], "Storage Explorer is a cross-platform GUI for Azure Storage resources and data."),
      q("Which access tier is typically best for frequently accessed blobs?", "Hot", ["Archive", "Cold", "Offline"], "The Hot tier has higher storage cost but lower access cost for frequently used data."),
      q("You must allow a subnet to reach Storage over the Azure backbone while keeping the public endpoint. What can you configure?", "A virtual network service endpoint", ["VNet peering only", "A DNS delegation", "An application gateway"], "A service endpoint secures the public service endpoint to selected VNets and subnets."),
      q("Which operation creates a point-in-time, read-only copy of an Azure file share?", "Create a share snapshot", ["Rehydrate the share", "Break a lease", "Rotate the account key"], "Share snapshots preserve a read-only point-in-time state of an Azure file share."),
    ]
  },
  {
    title: "Deploy and manage Azure compute resources",
    shortTitle: "Compute",
    description: "Virtual machines, App Service, containers, scale sets, ARM, and Bicep.",
    questions: [
      q("Which service manages identical autoscaling virtual machines behind a load balancer?", "Virtual Machine Scale Sets", ["Azure Dedicated Host", "Availability Sets", "Azure Batch account"], "Scale sets deploy and automatically scale groups of load-balanced VMs."),
      q("Which managed platform hosts web applications and supports deployment slots?", "Azure App Service", ["Azure Virtual Desktop", "Azure DNS", "Azure Files"], "App Service provides managed web hosting with staging deployment slots."),
      q("Which Azure-native declarative language provides concise infrastructure-as-code syntax?", "Bicep", ["KQL", "YAML pipelines only", "PowerShell DSC"], "Bicep compiles into Azure Resource Manager templates."),
      q("Which construct spreads VMs across fault domains and update domains within a datacenter?", "Availability set", ["Resource lock", "Management group", "Proximity placement group only"], "Availability sets reduce correlated hardware and maintenance failures."),
      q("Which VM disk type is temporary and can lose data during redeployment?", "Temporary disk", ["Managed OS disk", "Premium SSD data disk", "Standard SSD data disk"], "Temporary disks use local host storage and are not persistent."),
      q("You need to run a container quickly without managing servers or an orchestrator. Which service should you use?", "Azure Container Instances", ["Azure Virtual Desktop", "Azure Dedicated Host", "Azure VMware Solution"], "ACI runs containers on demand without VM or cluster management."),
      q("What must you do before changing many Azure VM sizes?", "Stop and deallocate the VM", ["Delete the resource group", "Detach the network interface", "Convert the disk to unmanaged"], "Deallocation releases the VM allocation so another supported size can be selected."),
      q("Which App Service feature lets you test a new version before swapping it into production?", "Deployment slot", ["Availability set", "Fault domain", "Scale set upgrade domain"], "Slots provide live app endpoints whose content and configuration can be swapped."),
      q("Where should you store private container images for Azure deployments?", "Azure Container Registry", ["Azure Queue Storage", "Azure DNS", "Azure Policy"], "ACR is a managed registry for private container images and artifacts."),
      q("Which VM extension runs scripts after a VM has been deployed?", "Custom Script Extension", ["Dependency Agent only", "Azure Policy extension", "Guest Configuration lock"], "The Custom Script Extension downloads and executes scripts inside Azure VMs."),
      q("What is the main benefit of an Azure managed disk?", "Azure manages the underlying storage account", ["It cannot be encrypted", "It is always ephemeral", "It can attach to unlimited VMs"], "Managed disks remove the need to provision and manage storage accounts for VM disks."),
      q("Which scaling method adds or removes VM instances in a scale set?", "Horizontal scaling", ["Vertical scaling", "Tiering", "Rehydration"], "Horizontal scaling changes the number of instances; vertical scaling changes instance size."),
      q("You need a dedicated physical server for compliance while still running Azure VMs. What should you use?", "Azure Dedicated Host", ["Availability zone", "Azure Bastion", "A spot VM"], "Dedicated Host provides physical servers dedicated to one Azure subscription."),
      q("Which pricing option can use unused Azure capacity but may be evicted at any time?", "Azure Spot Virtual Machines", ["Reserved capacity only", "Dedicated Hosts", "Standard pay-as-you-go VMs"], "Spot VMs offer discounts in exchange for possible eviction."),
      q("What does an ARM template define?", "The desired state of Azure resources", ["Only imperative CLI commands", "A KQL query", "A network packet capture"], "ARM templates declaratively define resources and their configuration."),
      q("Which VM setting automatically repairs or replaces unhealthy scale set instances when configured?", "Automatic instance repairs", ["Boot diagnostics", "Serial console", "Host caching"], "Automatic repairs monitor health and replace unhealthy scale-set instances."),
      q("What should you use to capture serial console output and screenshots during VM startup troubleshooting?", "Boot diagnostics", ["Azure DNS logs", "Cost Management", "Blob inventory"], "Boot diagnostics records console output and screenshots for VM boot issues."),
      q("Which App Service setting controls the number and size of compute instances?", "App Service plan", ["Deployment slot name", "Custom domain", "Authentication provider"], "The App Service plan defines region, operating system, pricing tier, and compute capacity."),
      q("Which command conceptually validates an ARM or Bicep deployment without creating resources?", "A what-if operation", ["A failover operation", "A blob rehydrate operation", "A DNS trace"], "What-if previews resource changes that a deployment would make."),
      q("Which Azure service manages Kubernetes clusters?", "Azure Kubernetes Service", ["Azure Container Instances", "Azure App Configuration", "Azure Batch"], "AKS provides managed Kubernetes control planes and cluster integration."),
    ]
  },
  {
    title: "Implement and manage virtual networking",
    shortTitle: "Networking",
    description: "VNets, NSGs, routing, load balancing, DNS, Bastion, and private access.",
    questions: [
      q("How can two Azure VNets communicate privately without a VPN gateway?", "Configure VNet peering", ["Create a NAT gateway", "Deploy Azure Front Door", "Assign public IPs"], "VNet peering carries private traffic over the Microsoft backbone."),
      q("Which resource filters traffic using source, destination, port, and protocol rules?", "Network Security Group", ["Route table", "Private DNS zone", "NAT gateway"], "NSGs contain prioritized inbound and outbound allow or deny rules."),
      q("Which service provides browser-based RDP and SSH to VMs without public IP addresses?", "Azure Bastion", ["Traffic Manager", "Azure DNS", "Application Gateway"], "Bastion connects to VM private IPs through the Azure portal over TLS."),
      q("What does a user-defined route control?", "The next hop for subnet traffic", ["Role assignments", "DNS record ownership", "Storage redundancy"], "Custom routes override Azure system routes to direct network traffic."),
      q("Which service distributes TCP and UDP traffic at OSI layer 4?", "Azure Load Balancer", ["Application Gateway", "Azure DNS", "Traffic Manager"], "Azure Load Balancer is a layer-4 load balancer for TCP and UDP flows."),
      q("Which service offers layer-7 load balancing and a web application firewall?", "Azure Application Gateway", ["NAT Gateway", "VPN Gateway", "Network Watcher"], "Application Gateway routes HTTP/S traffic and can include WAF protection."),
      q("Which global service uses DNS responses to distribute users among endpoints?", "Azure Traffic Manager", ["Internal Load Balancer", "Azure Bastion", "Private Link"], "Traffic Manager is a DNS-based global traffic load balancer."),
      q("Which subnet resource provides predictable outbound internet connectivity using static public IPs?", "NAT Gateway", ["Private endpoint", "NSG", "Route Server"], "NAT Gateway supplies scalable outbound SNAT connectivity for a subnet."),
      q("Which Network Watcher feature tests whether NSG rules allow traffic between two endpoints?", "IP flow verify", ["Connection Monitor only", "Topology", "Packet capture only"], "IP flow verify reports whether a packet is allowed or denied and identifies the rule."),
      q("Which DNS record maps a name to an IPv4 address?", "A record", ["AAAA record", "CNAME record", "MX record"], "An A record maps a host name to an IPv4 address."),
      q("What is required for resources in separate VNets to resolve names in one private DNS zone?", "Link each VNet to the private DNS zone", ["Assign public IPs", "Create an NSG rule", "Deploy a NAT gateway"], "Private DNS resolution is available to VNets linked to the zone."),
      q("Which connection encrypts traffic between an on-premises network and an Azure VNet over the public internet?", "Site-to-site VPN", ["VNet peering", "Service endpoint", "Private endpoint"], "A site-to-site VPN creates an IPsec tunnel between a local VPN device and Azure."),
      q("Which service provides a private dedicated WAN connection to Microsoft cloud services?", "Azure ExpressRoute", ["Azure Front Door", "Point-to-site VPN", "VNet peering"], "ExpressRoute uses a private provider connection rather than the public internet."),
      q("What must not overlap when peering two VNets?", "Their IP address spaces", ["Their resource group names", "Their DNS server names", "Their subscription display names"], "Peered VNets require non-overlapping address spaces for correct routing."),
      q("Which NSG rule is processed first?", "The matching rule with the lowest priority number", ["The newest rule", "The rule with the longest name", "The default rule always"], "NSG rules are evaluated in ascending priority-number order."),
      q("What does a private endpoint create in a VNet?", "A network interface with a private IP", ["A public DNS root zone", "A VPN tunnel", "A route to the internet"], "Private Link exposes the service through a private endpoint network interface."),
      q("Which service helps centrally manage hub-and-spoke connectivity and security routing?", "Azure Virtual WAN", ["Azure Files", "Azure Policy", "Azure Batch"], "Virtual WAN provides managed transit networking across branches, VNets, and users."),
      q("Which Network Watcher capability records packets from a VM network interface?", "Packet capture", ["NSG flow logs only", "IP flow verify", "Next hop"], "Packet capture collects packets from a VM for detailed troubleshooting."),
      q("Which load balancer type gives an Azure service a private frontend IP?", "Internal load balancer", ["Public load balancer", "Traffic Manager", "Azure Front Door"], "An internal load balancer exposes its frontend only within a virtual network."),
      q("What is the purpose of an Application Security Group?", "Group VM network interfaces for NSG rules", ["Group subscriptions for policy", "Publish DNS records", "Encrypt VPN traffic"], "ASGs let NSG rules refer to logical application groups instead of individual IP addresses."),
    ]
  },
  {
    title: "Monitor and maintain Azure resources",
    shortTitle: "Monitoring & Recovery",
    description: "Azure Monitor, alerts, Log Analytics, Backup, Site Recovery, and optimization.",
    questions: [
      q("Where do you query Azure Monitor log data by using KQL?", "A Log Analytics workspace", ["A private DNS zone", "A recovery services vault", "A network interface"], "Log Analytics workspaces store Azure Monitor Logs and support KQL queries."),
      q("What sends an email when an Azure Monitor alert fires?", "An action group", ["A resource lock", "A route table", "A workbook"], "Action groups define alert notification and automation actions."),
      q("Which service orchestrates replication and regional failover of Azure VMs?", "Azure Site Recovery", ["Azure Advisor", "Azure Update Manager", "Azure DNS"], "Site Recovery replicates workloads and orchestrates failover and failback."),
      q("Which Azure Monitor feature provides near-real-time numeric resource measurements?", "Metrics", ["Activity log only", "Service Health only", "Resource Graph"], "Metrics are time-series numeric values collected at frequent intervals."),
      q("Which log records subscription-level events such as creating or deleting a VM?", "Azure Activity Log", ["Guest OS event log only", "NSG flow log", "Storage analytics log"], "The Activity Log records control-plane events for Azure resources."),
      q("What should you create to back up an Azure virtual machine?", "A Recovery Services vault and backup policy", ["A traffic manager profile", "A private DNS zone", "A management group"], "Azure VM Backup stores recovery points in a vault according to a policy."),
      q("Which feature visualizes monitoring data in reusable interactive reports?", "Azure Monitor workbooks", ["Resource locks", "Availability sets", "Route tables"], "Workbooks combine metrics, logs, parameters, and visualizations in interactive reports."),
      q("Which service reports Azure platform incidents and planned maintenance affecting your resources?", "Azure Service Health", ["Azure Advisor", "Microsoft Entra ID", "Azure Policy"], "Service Health provides personalized service issues, maintenance, and advisories."),
      q("Which feature collects guest operating system performance data from Azure VMs?", "Azure Monitor Agent", ["Azure DNS agent", "NAT Gateway", "Resource Graph lock"], "Azure Monitor Agent collects monitoring data from guest operating systems."),
      q("What defines which data Azure Monitor Agent collects and where it sends the data?", "Data collection rule", ["Action group", "Route table", "Backup policy"], "Data collection rules specify sources, transformations, and destinations."),
      q("Which Azure Advisor category recommends changes that improve service resilience?", "Reliability", ["Tags", "Identity", "Networking only"], "Advisor Reliability recommendations help maintain continuity of business-critical applications."),
      q("Which alert type evaluates data returned by a Log Analytics query?", "Log search alert", ["Activity log alert only", "Metric alert only", "Service Health alert only"], "Log search alerts periodically evaluate a KQL query and its result."),
      q("What is the purpose of a backup retention policy?", "Define how long recovery points are kept", ["Set VM CPU thresholds", "Control network routing", "Assign Azure roles"], "Retention settings determine the lifetime of daily, weekly, monthly, or yearly recovery points."),
      q("Before a planned Site Recovery failover, which operation verifies recovery without affecting production?", "Test failover", ["Unplanned failover", "Commit", "Reprotect"], "A test failover validates the recovery plan in an isolated network."),
      q("Which Azure Monitor feature traces requests and dependencies for web applications?", "Application Insights", ["Network Watcher", "Azure Policy", "Cost Management"], "Application Insights provides application performance monitoring and distributed tracing."),
      q("Where can you create a budget and alerts for forecasted Azure spending?", "Cost Management", ["Azure Bastion", "Azure Backup", "Application Gateway"], "Cost Management budgets track actual or forecasted cost against thresholds."),
      q("Which tool centrally manages operating system updates for Azure and Arc-enabled servers?", "Azure Update Manager", ["Azure Traffic Manager", "Azure File Sync", "Azure Policy Insights only"], "Update Manager assesses and schedules updates across Azure and hybrid machines."),
      q("What does a metric alert use to decide when to fire?", "A monitored signal, condition, and threshold", ["A resource lock", "A DNS alias", "A storage access tier"], "Metric alert rules evaluate a metric against defined aggregation, operator, and threshold settings."),
      q("Which vault feature should be enabled to help protect backups from accidental deletion?", "Soft delete", ["Public network access", "Cross-region restore only", "Archive access tier"], "Soft delete retains deleted backup data for an additional recovery period."),
      q("Which Azure service lets you query resource configuration across subscriptions using KQL-like syntax?", "Azure Resource Graph", ["Azure Files", "Azure Front Door", "Azure Container Registry"], "Resource Graph rapidly queries Azure Resource Manager inventory across scopes."),
    ]
  }
];

const questionSections = rawQuestionSections.map(section => ({
  ...section,
  questions: section.questions.map((item, index) => {
    const options = [item.correct, ...item.distractors];
    const shift = index % options.length;
    const rotated = [...options.slice(shift), ...options.slice(0, shift)];
    return {
      domain: section.shortTitle,
      question: item.question,
      options: rotated,
      answer: rotated.indexOf(item.correct),
      explanation: item.explanation
    };
  })
}));

if (typeof module !== "undefined") module.exports = questionSections;
