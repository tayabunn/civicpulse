import bcrypt from 'bcryptjs';

export interface MockLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const SAMPLE_LOCATIONS: MockLocation[] = [
  { name: 'Dhanmondi 27', address: 'House 42, Road 27, Dhanmondi, Dhaka', latitude: 23.7538, longitude: 90.3776 },
  { name: 'Gulshan 2 Circle', address: 'Plot 15, Gulshan Avenue, Gulshan 2, Dhaka', latitude: 23.7925, longitude: 90.4167 },
  { name: 'Mirpur 10 Roundabout', address: 'Block C, Section 10, Mirpur, Dhaka', latitude: 23.8069, longitude: 90.3687 },
  { name: 'Banani 11', address: 'Road 11, Block D, Banani, Dhaka', latitude: 23.7937, longitude: 90.4048 },
  { name: 'Uttara Sector 3', address: 'Rabindra Sarani, Sector 3, Uttara, Dhaka', latitude: 23.8698, longitude: 90.3985 },
  { name: 'Motijheel Commercial Area', address: 'Dilkusha C/A, Motijheel, Dhaka', latitude: 23.7330, longitude: 90.4172 },
  { name: 'Mohakhali Wireless Gate', address: 'Wireless Gate, Mohakhali, Dhaka', latitude: 23.7776, longitude: 90.4054 },
  { name: 'Kawran Bazar', address: 'Kazi Nazrul Islam Ave, Kawran Bazar, Dhaka', latitude: 23.7516, longitude: 90.3938 },
  { name: 'Shahbagh Square', address: 'Shahbagh Intersection, Dhaka', latitude: 23.7388, longitude: 90.3957 },
  { name: 'Badda Link Road', address: 'Middle Badda, Progoti Sarani, Dhaka', latitude: 23.7806, longitude: 90.4267 },
  { name: 'Farmgate Overbridge', address: 'Farmgate, Tejgaon, Dhaka', latitude: 23.7570, longitude: 90.3887 },
  { name: 'Lalbagh Fort Road', address: 'Lalbagh Road, Lalbagh, Old Dhaka', latitude: 23.7188, longitude: 90.3881 },
  { name: 'Bashundhara R/A Gate', address: 'Block A, Bashundhara R/A, Dhaka', latitude: 23.8151, longitude: 90.4255 },
  { name: 'Shyamoli Square', address: 'Mirpur Road, Shyamoli, Dhaka', latitude: 23.7725, longitude: 90.3648 },
  { name: 'Panthapath Signal', address: 'Panthapath, Green Road Crossing, Dhaka', latitude: 23.7511, longitude: 90.3855 },
  { name: 'Tejgaon Industrial Area', address: 'Shaheed Tajuddin Ahmed Sarani, Tejgaon, Dhaka', latitude: 23.7663, longitude: 90.4001 },
  { name: 'Malibagh Railgate', address: 'Malibagh Chowdhury Para, Dhaka', latitude: 23.7514, longitude: 90.4140 },
  { name: 'Moghbazar Wireless', address: 'Moghbazar Crossing, Dhaka', latitude: 23.7490, longitude: 90.4032 },
  { name: 'Rampura Bridge', address: 'DIT Road, Rampura, Dhaka', latitude: 23.7618, longitude: 90.4246 },
  { name: 'Khilgaon Flyover', address: 'Shahid Baki Road, Khilgaon, Dhaka', latitude: 23.7505, longitude: 90.4230 },
  { name: 'Agargaon Science Museum', address: 'Sher-e-Bangla Nagar, Agargaon, Dhaka', latitude: 23.7770, longitude: 90.3792 },
  { name: 'Mohammadpur Town Hall', address: 'Asad Avenue, Mohammadpur, Dhaka', latitude: 23.7600, longitude: 90.3620 },
  { name: 'Paltan Intersection', address: 'Purana Paltan, Dhaka', latitude: 23.7314, longitude: 90.4116 },
  { name: 'Bijoy Sarani Link', address: 'Aeroplane Crossing, Bijoy Sarani, Dhaka', latitude: 23.7661, longitude: 90.3871 },
  { name: 'Gopibagh Rail Crossing', address: 'Gopibagh, Dhaka', latitude: 23.7225, longitude: 90.4241 },
  { name: 'Kakrail Mosque Circle', address: 'Hare Road, Kakrail, Dhaka', latitude: 23.7397, longitude: 90.4053 },
  { name: 'Elephant Road Market', address: 'New Elephant Road, Dhaka', latitude: 23.7408, longitude: 90.3847 },
  { name: 'Azimpur Bus Stand', address: 'Azimpur Estate, Dhaka', latitude: 23.7291, longitude: 90.3842 },
  { name: 'Hazaribagh Park', address: 'Hazaribagh Tannery Area, Dhaka', latitude: 23.7350, longitude: 90.3667 },
  { name: 'Baridhara J-Block', address: 'Park Road, Baridhara Diplomatic Zone, Dhaka', latitude: 23.8011, longitude: 90.4225 },
  { name: 'Nikunja 2 Gate', address: 'Khilkhet, Nikunja 2, Dhaka', latitude: 23.8315, longitude: 90.4182 },
  { name: 'Mirpur 1 Bus Terminal', address: 'Section 1, Mirpur, Dhaka', latitude: 23.7955, longitude: 90.3533 },
];

export const MOCK_DEPARTMENTS: Array<{ id: string; name: string; code: string; description: string; managerId?: string }> = [
  { id: 'd0000000-0000-0000-0000-000000000001', name: 'Roads & Highways', code: 'DEPT-ROAD', description: 'Municipal road paving, pothole repairs, street markers and bridges.' },
  { id: 'd0000000-0000-0000-0000-000000000002', name: 'Electrical & Street Lighting', code: 'DEPT-ELEC', description: 'Streetlights, electrical wiring, transformers and traffic signals.' },
  { id: 'd0000000-0000-0000-0000-000000000003', name: 'Water Supply & Sewage', code: 'DEPT-WATER', description: 'Storm drainage lines, sewage overflow, clean water mains, manhole covers.' },
  { id: 'd0000000-0000-0000-0000-000000000004', name: 'Solid Waste Management', code: 'DEPT-WASTE', description: 'Trash bin clearance, waste dumping removal, organic disposal and sanitization.' },
  { id: 'd0000000-0000-0000-0000-000000000005', name: 'Public Infrastructure & Parks', code: 'DEPT-INFRA', description: 'Footpaths, pedestrian overpasses, public park benches and civic structures.' },
];

export function generateSeedData() {
  const defaultHash = bcrypt.hashSync('password123', 6);
  const adminHash = bcrypt.hashSync('admin123', 6);
  const managerHash = bcrypt.hashSync('manager123', 6);
  const staffHash = bcrypt.hashSync('staff123', 6);
  const citizenHash = bcrypt.hashSync('citizen123', 6);

  // 1. Users
  const users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'department_manager' | 'maintenance_staff' | 'citizen';
    departmentId?: string;
    phone?: string;
  }> = [
    // 4 Primary Demo Users
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'City Administrator (Chief Operations)',
      email: 'admin@civicpulse.gov',
      passwordHash: adminHash,
      role: 'admin',
      phone: '+880 1711 000001',
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Tariq Rahman (Roads Dept Manager)',
      email: 'manager.roads@civicpulse.gov',
      passwordHash: managerHash,
      role: 'department_manager',
      departmentId: MOCK_DEPARTMENTS[0].id,
      phone: '+880 1711 000002',
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Rafiqul Islam (Senior Field Electrician)',
      email: 'staff.electric@civicpulse.gov',
      passwordHash: staffHash,
      role: 'maintenance_staff',
      departmentId: MOCK_DEPARTMENTS[1].id,
      phone: '+880 1711 000003',
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      name: 'Jane Citizen',
      email: 'citizen.jane@civicpulse.gov',
      passwordHash: citizenHash,
      role: 'citizen',
      phone: '+880 1711 000004',
    },
    // Other 4 Department Managers
    {
      id: '10000000-0000-0000-0000-000000000005',
      name: 'Nusrat Jahan (Electrical Dept Manager)',
      email: 'manager.electric@civicpulse.gov',
      passwordHash: managerHash,
      role: 'department_manager',
      departmentId: MOCK_DEPARTMENTS[1].id,
      phone: '+880 1711 000005',
    },
    {
      id: '10000000-0000-0000-0000-000000000006',
      name: 'Kamal Hossain (Water & Sewage Manager)',
      email: 'manager.water@civicpulse.gov',
      passwordHash: managerHash,
      role: 'department_manager',
      departmentId: MOCK_DEPARTMENTS[2].id,
      phone: '+880 1711 000006',
    },
    {
      id: '10000000-0000-0000-0000-000000000007',
      name: 'Farhana Ahmed (Waste Mgmt Manager)',
      email: 'manager.waste@civicpulse.gov',
      passwordHash: managerHash,
      role: 'department_manager',
      departmentId: MOCK_DEPARTMENTS[3].id,
      phone: '+880 1711 000007',
    },
    {
      id: '10000000-0000-0000-0000-000000000008',
      name: 'Ziaur Rahman (Infrastructure Manager)',
      email: 'manager.infra@civicpulse.gov',
      passwordHash: managerHash,
      role: 'department_manager',
      departmentId: MOCK_DEPARTMENTS[4].id,
      phone: '+880 1711 000008',
    },
  ];

  // 20 Maintenance Staff (4 per each of 5 departments)
  const staffNames = [
    ['Karim Mia', 'Shahidul Alam', 'Biplob Sen', 'Moniruzzaman'],
    ['Habibur Rahman', 'Al-Amin Hossain', 'Jahangir Kabir', 'Tanvir Ahmed'],
    ['Delwar Hossain', 'Sultan Mahmud', 'Rezaul Karim', 'Nazmul Huda'],
    ['Ratan Das', 'Shujon Barua', 'Mukul Sheikh', 'Anisur Rahman'],
    ['Arifur Rahman', 'Faruk Mia', 'Saiful Islam', 'Badal Chandra'],
  ];

  let staffIdx = 10;
  for (let deptI = 0; deptI < 5; deptI++) {
    const dept = MOCK_DEPARTMENTS[deptI];
    for (const name of staffNames[deptI]) {
      const email = `staff.${name.toLowerCase().replace(/[^a-z]/g, '')}@civicpulse.gov`;
      users.push({
        id: `10000000-0000-0000-0000-${String(staffIdx).padStart(12, '0')}`,
        name: `${name} (Crew Tech)`,
        email,
        passwordHash: staffHash,
        role: 'maintenance_staff',
        departmentId: dept.id,
        phone: `+880 1711 ${String(staffIdx).padStart(6, '0')}`,
      });
      staffIdx++;
    }
  }

  // Extra Citizens
  const citizenNames = ['Ayesha Siddika', 'Rahim Ullah', 'Tasnim Khan', 'Tanima Chowdhury', 'Mahmudul Hasan'];
  let citizenIdx = 40;
  for (const name of citizenNames) {
    users.push({
      id: `10000000-0000-0000-0000-${String(citizenIdx).padStart(12, '0')}`,
      name,
      email: `citizen.${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      passwordHash: defaultHash,
      role: 'citizen',
      phone: `+880 1811 ${String(citizenIdx).padStart(6, '0')}`,
    });
    citizenIdx++;
  }

  const categoryDeptMap: Record<string, string> = {
    road_damage: MOCK_DEPARTMENTS[0].id,
    streetlight: MOCK_DEPARTMENTS[1].id,
    drainage: MOCK_DEPARTMENTS[2].id,
    waste_management: MOCK_DEPARTMENTS[3].id,
    footpath: MOCK_DEPARTMENTS[4].id,
    public_infrastructure: MOCK_DEPARTMENTS[4].id,
  };

  const categories = [
    'road_damage',
    'streetlight',
    'drainage',
    'footpath',
    'waste_management',
    'public_infrastructure',
  ] as const;

  const priorities = ['low', 'medium', 'high', 'critical'] as const;
  const statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'] as const;

  const issueTitles: Record<string, string[]> = {
    road_damage: [
      'Hazardous pothole expanding near traffic signal',
      'Asphalt cracking and uneven road surface',
      'Sunken road section causing vehicular damage',
      'Deep crater on main bus route',
      'Road cave-in after heavy rainfall',
    ],
    streetlight: [
      'Entire street dark due to non-functioning LED light',
      'Flickering high-mast lamp pole risking pedestrians',
      'Exposed electrical wire from damaged light base',
      'Broken solar street light fixture',
      'Timer malfunction: streetlight off during night hours',
    ],
    drainage: [
      'Severe stormwater drain blockage causing road waterlogging',
      'Broken manhole cover missing on main walkway',
      'Overflowing sewage line producing foul odor',
      'Clogged culvert impeding municipal water flow',
      'Open drainage ditch posing fall hazard for children',
    ],
    footpath: [
      'Broken pavement tiles causing pedestrian tripping',
      'Footpath encroached by construction rubble',
      'Damaged tactile paving for visually impaired',
      'Missing curb ramp near hospital crosswalk',
      'Severely sunken footpath slab after drainage work',
    ],
    waste_management: [
      'Overflowing municipal waste container spilling on roadway',
      'Illegal garbage dumping along residential wall',
      'Uncollected organic waste rotting in open air',
      'Missing community waste bin on busy avenue',
      'Hazardous industrial scrap dumped near playground',
    ],
    public_infrastructure: [
      'Damaged pedestrian overpass railing loose and vibrating',
      'Broken concrete bench in municipal public park',
      'Damaged road safety guardrail after collision',
      'Civic boundary wall leaning dangerously',
      'Broken public water fountain tap wasting water',
    ],
  };

  const issues: Array<{
    id: string;
    title: string;
    description: string;
    category: typeof categories[number];
    status: typeof statuses[number];
    priority: typeof priorities[number];
    latitude: number;
    longitude: number;
    address: string;
    imageUrl: string;
    reporterId: string;
    departmentId: string;
    assignedStaffId?: string;
    feedbackRating?: number;
    feedbackComment?: string;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
  }> = [];

  const activities: Array<{
    id: string;
    issueId: string;
    userId: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    notes: string;
    createdAt: Date;
  }> = [];

  const tasks: Array<{
    id: string;
    issueId: string;
    staffId: string;
    status: 'pending' | 'in_progress' | 'completed';
    fieldNotes?: string;
    assignedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
  }> = [];

  let issueNumber = 1;
  const staffByDept: Record<string, string[]> = {};
  for (const u of users) {
    if (u.role === 'maintenance_staff' && u.departmentId) {
      if (!staffByDept[u.departmentId]) staffByDept[u.departmentId] = [];
      staffByDept[u.departmentId].push(u.id);
    }
  }

  const citizens = users.filter((u) => u.role === 'citizen');

  for (const category of categories) {
    const titles = issueTitles[category];
    const deptId = categoryDeptMap[category];
    const deptStaff = staffByDept[deptId] || [users[2].id];

    for (let i = 0; i < 18; i++) {
      const issueId = `a0000000-0000-0000-0000-${String(issueNumber).padStart(12, '0')}`;
      const title = `${titles[i % titles.length]} #${issueNumber}`;
      const location = SAMPLE_LOCATIONS[(issueNumber * 7) % SAMPLE_LOCATIONS.length];
      const priority = priorities[i % priorities.length];
      const status = statuses[i % statuses.length];
      const reporter = citizens[i % citizens.length];
      const assignedStaff = status !== 'submitted' && status !== 'under_review' ? deptStaff[i % deptStaff.length] : undefined;

      const daysAgo = Math.floor(Math.random() * 120) + 1;
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const updatedAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 6);
      const isResolvedOrClosed = status === 'resolved' || status === 'closed';
      const resolvedAt = isResolvedOrClosed
        ? new Date(createdAt.getTime() + 1000 * 60 * 60 * (priority === 'critical' ? 18 : priority === 'high' ? 36 : 72))
        : undefined;

      const issue = {
        id: issueId,
        title,
        description: `Citizens in ${location.name} have reported ${title.toLowerCase()}. Immediate municipal attention requested to restore public safety and infrastructure integrity at ${location.address}.`,
        category,
        status,
        priority,
        latitude: location.latitude + (Math.random() - 0.5) * 0.003,
        longitude: location.longitude + (Math.random() - 0.5) * 0.003,
        address: location.address,
        imageUrl: `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60`,
        reporterId: reporter.id,
        departmentId: deptId,
        assignedStaffId: assignedStaff,
        feedbackRating: status === 'closed' ? (i % 2 === 0 ? 5 : 4) : undefined,
        feedbackComment: status === 'closed' ? 'Prompt repair and professional response by city maintenance team!' : undefined,
        createdAt,
        updatedAt,
        resolvedAt,
      };
      issues.push(issue);

      activities.push({
        id: `a0000000-0000-0000-0000-${String(issueNumber * 3).padStart(12, '0')}`,
        issueId,
        userId: reporter.id,
        action: 'SUBMITTED',
        previousStatus: undefined,
        newStatus: 'submitted',
        notes: 'Citizen submitted infrastructure issue with GPS coordinates.',
        createdAt,
      });

      if (status !== 'submitted') {
        activities.push({
          id: `a0000000-0000-0000-0000-${String(issueNumber * 3 + 1).padStart(12, '0')}`,
          issueId,
          userId: MOCK_DEPARTMENTS.find((d) => d.id === deptId)?.managerId || users[1].id,
          action: 'REVIEWED',
          previousStatus: 'submitted',
          newStatus: 'under_review',
          notes: `Department verified priority as ${priority.toUpperCase()}.`,
          createdAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 2),
        });
      }

      if (assignedStaff) {
        const taskStatus = status === 'in_progress' ? 'in_progress' : isResolvedOrClosed ? 'completed' : 'pending';
        tasks.push({
          id: `b0000000-0000-0000-0000-${String(issueNumber).padStart(12, '0')}`,
          issueId,
          staffId: assignedStaff,
          status: taskStatus,
          fieldNotes: isResolvedOrClosed ? 'Site inspected, civil repairs finished, area cleared of debris.' : 'Work order received.',
          assignedAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 4),
          startedAt: status !== 'assigned' ? new Date(createdAt.getTime() + 1000 * 60 * 60 * 8) : undefined,
          completedAt: isResolvedOrClosed ? resolvedAt : undefined,
        });

        activities.push({
          id: `a0000000-0000-0000-0000-${String(issueNumber * 3 + 2).padStart(12, '0')}`,
          issueId,
          userId: assignedStaff,
          action: isResolvedOrClosed ? 'RESOLVED' : 'ASSIGNED',
          previousStatus: 'under_review',
          newStatus: status,
          notes: isResolvedOrClosed ? 'Field crew uploaded repair photograph and marked work order complete.' : 'Assigned to field technician.',
          createdAt: isResolvedOrClosed && resolvedAt ? resolvedAt : new Date(createdAt.getTime() + 1000 * 60 * 60 * 5),
        });
      }

      issueNumber++;
    }
  }

  return {
    departments: MOCK_DEPARTMENTS,
    users,
    issues,
    activities,
    tasks,
    locations: SAMPLE_LOCATIONS,
  };
}
