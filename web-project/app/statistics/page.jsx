import { useEffect, useState } from 'react';

const statsEndpoints = [
  { key: 'userTypeCounts', label: 'Number of users per user type', url: '/api/stats/userTypeCounts' },
  { key: 'studentsPerCourse', label: 'Number of students per course', url: '/api/stats/studentsPerCourse' },
  { key: 'studentsPerCourseCategory', label: 'Number of students per course category', url: '/api/stats/studentsPerCourseCategory' },
  { key: 'topCourses', label: 'Top 3 most enrolled courses', url: '/api/stats/topCourses' },
  { key: 'coursesWithHighestFailureRate', label: 'Courses with the highest failure rate', url: '/api/stats/coursesWithHighestFailureRate' },
  { key: 'averageGradePerCourse', label: 'Average grade per course', url: '/api/stats/averageGradePerCourse' },
  { key: 'studentsPerInstructor', label: 'Number of students per instructor', url: '/api/stats/studentsPerInstructor' },
  { key: 'studentsFailingMoreThanTwoCourses', label: 'Number of students failing more than 2 courses', url: '/api/stats/studentsFailingMoreThanTwoCourses' },
  { key: 'coursesPerCategory', label: 'Number of courses per category', url: '/api/stats/coursesPerCategory' },
  { key: 'mostImprovedStudent', label: 'Most improved student', url: '/api/stats/mostImprovedStudent' },
];

export default function StatisticsPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllStats() {
      const results = {};
      for (const stat of statsEndpoints) {
        try {
          const res = await fetch(stat.url);
          results[stat.key] = await res.json();
        } catch (e) {
          results[stat.key] = { error: e.message };
        }
      }
      setStats(results);
      setLoading(false);
    }
    fetchAllStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Student Management System Statistics</h1>
      {statsEndpoints.map(stat => (
        <section key={stat.key} style={{ marginBottom: 32, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <h2>{stat.label}</h2>
          <pre style={{ background: '#f8f8f8', padding: 12, borderRadius: 4, overflowX: 'auto' }}>
            {JSON.stringify(stats[stat.key], null, 2)}
          </pre>
        </section>
      ))}
    </div>
  );
} 