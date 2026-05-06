import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm font-medium">🏫 Education Made Easy</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              School Management
              <span className="block text-blue-300">System</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Complete platform for managing students, teachers, courses, grades, and more.
              Streamline your educational institution with one powerful solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
              >
                Get Started -&gt;
              </Link>
              <Link
                href="#features"
                className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-gray-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything you need to manage your school
            </h2>
            <p className="text-gray-600 text-lg">
              Powerful features designed to simplify administration, improve communication, and enhance learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition">
                <span className="text-3xl group-hover:text-white transition">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Student Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Register, track, and manage student records. View academic history, attendance, and performance analytics.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-green-600 transition">
                <span className="text-3xl group-hover:text-white transition">👩‍🏫</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Teacher Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage teacher profiles, assign courses, track qualifications, and monitor performance.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-purple-600 transition">
                <span className="text-3xl group-hover:text-white transition">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Course Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create and manage course offerings, assign teachers, set schedules, and track enrollment.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-yellow-600 transition">
                <span className="text-3xl group-hover:text-white transition">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Grade Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Record and analyze student performance. Generate report cards and progress reports.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-red-600 transition">
                <span className="text-3xl group-hover:text-white transition">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Attendance Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Easy attendance tracking per class, automated reports, and absence notifications.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition">
                <span className="text-3xl group-hover:text-white transition">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fee Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage fee structures, track payments, generate receipts, and send payment reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Students Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-200">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join hundreds of schools using our platform to manage their daily operations.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Login to Dashboard -&gt;
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 School Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
