import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom hook for responsive chart sizing
const useChartDimensions = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 250 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        setDimensions({
          width: width - 32, // Subtract padding
          height: Math.min(250, window.innerHeight * 0.3)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  return dimensions;
};

// Define dummy data for each platform
const platformData: Record<string, PlatformData> = {
  all: {
    chartData: [
      { name: 'Jan', value: 1000 },
      { name: 'Feb', value: 2000 },
      { name: 'Mar', value: 3000 },
      { name: 'Apr', value: 4000 },
      { name: 'May', value: 5000 },
    ],
    audienceData: {
      gender: [
        { label: 'Male', percentage: 60 },
        { label: 'Female', percentage: 35 },
        { label: 'Other', percentage: 5 }
      ],
      age: [
        { label: '13-17', percentage: 10 },
        { label: '18-24', percentage: 40 },
        { label: '25-34', percentage: 30 },
        { label: '35-44', percentage: 15 },
        { label: '45+', percentage: 5 }
      ],
      interests: [
        { label: 'Gaming', percentage: 50 },
        { label: 'Technology', percentage: 20 },
        { label: 'Entertainment', percentage: 20 },
        { label: 'Sports', percentage: 10 }
      ],
      location: [
        { label: 'United States', percentage: 35 },
        { label: 'United Kingdom', percentage: 20 },
        { label: 'Canada', percentage: 15 },
        { label: 'Germany', percentage: 10 },
        { label: 'Australia', percentage: 10 },
        { label: 'Others', percentage: 10 }
      ]
    }
  },
  // Add more platforms as needed
};

// Function to get data for the selected platform
const getPlatformData = (platform: string): PlatformData => {
  return platformData[platform] || platformData.all;
};

// 1. Add missing videos and highlights data arrays
const videos = [
  // Add sample video data
  {
    thumbnail: "sample-thumbnail.jpg",
    title: "Sample Video",
    views: "1K views",
    date: "2 days ago"
  }
  // Add more videos as needed
];

const highlights = [
  // Add sample highlight data
  {
    title: "Achievement 1",
    subtitle: "Major Milestone",
    stats: "100K+",
    conversions: "10% increase"
  }
  // Add more highlights as needed
];

// 8. Add missing interfaces
interface ChartItem {
  title: string;
  color: string;
  data: ChartData[];
  ref: React.RefObject<HTMLDivElement>;
  dims: {
    width: number;
    height: number;
  };
}

interface ChartData {
  name: string;
  value: number;
}

interface PlatformData {
  chartData: ChartData[];
  audienceData: {
    gender: DemographicItem[];
    age: DemographicItem[];
    interests: DemographicItem[];
    location: DemographicItem[];
  };
}

// 2. Add proper types for map functions
interface DemographicItem {
  label: string;
  percentage: number;
}

export default function MediaKit() {
  const [selectedPlatform] = useState<string>('all');
  const { chartData, audienceData } = getPlatformData(selectedPlatform);

  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartRef4 = useRef(null);

  const dims1 = useChartDimensions(chartRef1);
  const dims2 = useChartDimensions(chartRef2);
  const dims3 = useChartDimensions(chartRef3);
  const dims4 = useChartDimensions(chartRef4);

  const charts = [
    { title: "Followers Growth", color: "#8884d8", data: chartData, ref: chartRef1, dims: dims1 },
    { title: "Following Growth", color: "#36B9CC", data: chartData, ref: chartRef2, dims: dims2 },
    { title: "Engagement Rate", color: "#F6C23E", data: chartData, ref: chartRef3, dims: dims3 },
    { title: "Average Likes", color: "#E74A3B", data: chartData, ref: chartRef4, dims: dims4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Media Kit Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Content */}
        <div className="col-span-1 lg:col-span-6 bg-gray-100 rounded-2xl p-4 sm:p-6">
          <h2 className="text-purple-400 text-2xl sm:text-3xl lg:text-4xl mb-4">Your Name</h2>
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">Media</h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">Kit</h1>
          </div>
          <p className="text-gray-600 mt-4 sm:mt-6 text-base sm:text-lg">
            Write something about yourself here.
            Keep it short, simple and include a bit
            of your personality!
          </p>
        </div>

        {/* Right Content */}
        <div className="col-span-1 lg:col-span-6 grid grid-cols-6 grid-rows-6 gap-2 sm:gap-4 h-[250px] sm:h-[300px] md:h-[350px] lg:h-auto">
          {/* Main Image */}
          <div className="col-span-4 row-span-4 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
            <img 
              src="your-profile-pic.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          {/* Additional Boxes */}
          <div className="col-span-2 row-span-4 bg-green-400 rounded-2xl"></div>
          <div className="col-span-2 row-span-2 bg-purple-400 rounded-2xl flex items-center justify-center text-4xl">
            👋
          </div>
          <div className="col-span-4 row-span-2 bg-coral-400 rounded-2xl" style={{ backgroundColor: '#FFA69E' }}></div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <span className="text-2xl">📈</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {charts.map((chart: ChartItem, index: number) => (
            <div 
              key={index}
              ref={chart.ref}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">{chart.title}</h3>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={chart.dims.height}>
                  <LineChart 
                    data={chart.data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#888"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={chart.color}
                      strokeWidth={2}
                      dot={{ stroke: chart.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Section */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Audience</h2>
          <span className="text-2xl">👥</span>
        </div>

        <div className="space-y-8">
          {/* Gender Demographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Gender</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {audienceData.gender.map((item: DemographicItem, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Age Demographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Age</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {audienceData.age.map((item: DemographicItem, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Interests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {audienceData.interests.map((item: DemographicItem, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Demographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Location</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {/* Stacked bar */}
              <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
                {audienceData.location.map((item: DemographicItem, index: number) => {
                  // Define complementary colors
                  const colors = [
                    '#FF6B6B', // Coral Red
                    '#4ECDC4', // Turquoise
                    '#45B7D1', // Sky Blue
                    '#96CEB4', // Sage Green
                    '#FFEEAD', // Soft Yellow
                    '#D4A5A5'  // Dusty Rose
                  ];

                  return (
                    <div
                      key={index}
                      className="h-full relative group"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: colors[index % colors.length]
                      }}
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                        {item.label}: {item.percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Labels below the bar */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {audienceData.location.map((item: DemographicItem, index: number) => {
                  const colors = [
                    '#FF6B6B',
                    '#4ECDC4',
                    '#45B7D1',
                    '#96CEB4',
                    '#FFEEAD',
                    '#D4A5A5'
                  ];
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm text-gray-600">{item.label} ({item.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Published Videos */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl p-3 sm:p-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Latest Published Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {videos.map((video, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-sm">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{video.views}</p>
                <p className="text-xs text-gray-400">{video.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Highlights */}
      <div className="mt-6 sm:mt-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {highlights.slice(-4).map((highlight, index) => (
            <div 
              key={index} 
              className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-bold text-lg mb-2 text-center">{highlight.title}</h3>
              <p className="text-gray-500 mb-2 text-center">{highlight.subtitle}</p>
              <p className="text-green-500 font-semibold text-center">{highlight.stats}</p>
              <p className="text-green-500 text-center">{highlight.conversions}</p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-yellow-100 rounded-xl p-4 sm:p-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Let's Talk</h2>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
}

