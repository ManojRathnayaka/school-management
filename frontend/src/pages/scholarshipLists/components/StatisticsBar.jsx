function StatisticsBar({ applications }) {
    return (
                  <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-lg border-l-4 border-yellow-500 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                <p className="text-2xl font-bold text-blue-700">{applications.length}</p>
              </div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{applications.filter(a => a.status === 'pending').length}</p>
              </div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</p>
              </div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
              </div>
            </div>
          </div>
    )
}

export default StatisticsBar;