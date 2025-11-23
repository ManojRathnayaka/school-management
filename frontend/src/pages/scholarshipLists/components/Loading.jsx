import Layout from "../../../components/Layout";

function Loading() {
    return (
          <Layout activePage="scholarship-list">
                 <div className="flex justify-center items-center h-64 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
                   <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                     <p className="text-xl text-blue-700 font-semibold">Loading applications...</p>
                   </div>
                 </div>
               </Layout>
    )
}

export default Loading;