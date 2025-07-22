

import AdminLayout from '../components/AdminLayout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
 
  faShoppingCart,
  faClock,
  faCheckCircle,


} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  
  // Mock data for the dashboard
  const satisfactionData = [
    { label: 'Satisfied', percentage: 100 },
    { label: 'Neutral', percentage: 60 },
    { label: 'Dissatisfied', percentage: 80 }
  ];

  const salesData = [
    { label: 'Cameras', percentage: 80 },
    { label: 'Lenses', percentage: 60 },
    { label: 'Drones', percentage: 70 }
  ];

  const summaryCards = [
    { title: 'Average Rental Price', value: '$150' },
    { title: 'Total Products Rented', value: '500' },
    { title: 'Revenue Generated', value: '$75,000' }
  ];

  const newProducts = [
    {
      id: 1,
      name: 'Camera Model X',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=40&h=40&fit=crop&crop=center',
      status: 'Success',
      price: '$200'
    },
    {
      id: 2,
      name: 'Lens 50mm',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=40&h=40&fit=crop&crop=center',
      status: 'Pending',
      price: '$100'
    },
    {
      id: 3,
      name: 'Drone Pro',
      image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=40&h=40&fit=crop&crop=center',
      status: 'Canceled',
      price: '$300'
    }
  ];

  const feedItems = [
    {
      id: 1,
      icon: faShoppingCart,
      title: 'New Order Received',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: faClock,
      title: 'Pending Task: Process Returns',
      time: '4 hours ago'
    },
    {
      id: 3,
      icon: faCheckCircle,
      title: 'Completed Task: Inventory Update',
      time: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
      

       

          {/* Main Content */}
          <div className="flex-1 p-4">
            <div className="max-w-6xl mx-auto">
              {/* Dashboard Title */}
              <div className="mb-10 mt-10">
                <h1 className="text-gray-800 text-3xl font-bold">Dashboard</h1>
              </div>

              {/* Metrics Cards */}
              <div className="flex flex-wrap gap-4 mb-8">
                {/* Satisfaction Metrics */}
                <div className="flex min-w-72 flex-1 flex-col gap-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-800 text-base font-medium">Satisfaction Metrics</p>
                  <p className="text-gray-800 text-3xl font-bold">95%</p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 text-base">Current</p>
                    <p className="text-green-600 text-base font-medium">+5%</p>
                  </div>
                  <div className="grid gap-y-4 py-3">
                    {satisfactionData.map((item, index) => (
                      <div key={index} className="grid grid-cols-[auto_1fr] gap-4 items-center">
                        <p className="text-gray-600 text-sm font-bold">{item.label}</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-400 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Distribution */}
                <div className="flex min-w-72 flex-1 flex-col gap-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-800 text-base font-medium">Sales Distribution</p>
                  <p className="text-gray-800 text-3xl font-bold">80%</p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 text-base">Current</p>
                    <p className="text-green-600 text-base font-medium">+3%</p>
                  </div>
                  <div className="grid gap-y-4 py-3">
                    {salesData.map((item, index) => (
                      <div key={index} className="grid grid-cols-[auto_1fr] gap-4 items-center">
                        <p className="text-gray-600 text-sm font-bold">{item.label}</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-400 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="flex flex-wrap gap-4 mb-8">
                {summaryCards.map((card, index) => (
                  <div key={index} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-gray-200">
                    <p className="text-gray-800 text-base font-medium">{card.title}</p>
                    <p className="text-gray-800 text-2xl font-bold">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* New Products Table */}
              <div className="mb-8">
                <h2 className="text-gray-800 text-2xl font-bold mb-4">New Products</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Product Image</th>
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Stock Status</th>
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Price</th>
                        <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newProducts.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200">
                          <td className="h-[72px] px-4 py-2">
                            <div
                              className="w-10 h-10 rounded-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${product.image})` }}
                            ></div>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-gray-800 text-sm">
                            {product.name}
                          </td>
                          <td className="h-[72px] px-4 py-2">
                            <button className={`flex min-w-[84px] items-center justify-center rounded-xl h-8 px-4 text-sm font-medium w-full ${getStatusColor(product.status)}`}>
                              {product.status}
                            </button>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-gray-600 text-sm">
                            {product.price}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-gray-600 text-sm font-bold">
                            Edit, Delete
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feed Section */}
              <div>
                <h2 className="text-gray-800 text-2xl font-bold mb-4">Feed</h2>
                <div className="flex flex-col gap-4">
                  {feedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
                      <FontAwesomeIcon icon={item.icon} className="text-xl text-gray-600" />
                      <div>
                        <p className="text-gray-800 font-medium">{item.title}</p>
                        <p className="text-gray-500 text-sm">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    
    </AdminLayout>
  );
};

export default Dashboard;