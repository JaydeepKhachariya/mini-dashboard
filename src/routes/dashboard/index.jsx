import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, CheckSquare, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function DashboardHome() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    todos: 0,
    completedTodos: 0,
  });
  const [userActivityData, setUserActivityData] = useState([]);
  const [postsByUser, setPostsByUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes, todosRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
          fetch("https://jsonplaceholder.typicode.com/todos"),
        ]);

        const users = await usersRes.json();
        const posts = await postsRes.json();
        const todos = await todosRes.json();

        const completedTodos = todos.filter((todo) => todo.completed).length;

        setStats({
          users: users.length,
          posts: posts.length,
          todos: todos.length,
          completedTodos,
        });

        // User activity data for line chart
        const activityData = users.slice(0, 6).map((user) => ({
          name: user.name.split(" ")[0],
          posts: posts.filter((post) => post.userId === user.id).length,
          todos: todos.filter((todo) => todo.userId === user.id).length,
        }));
        setUserActivityData(activityData);

        // Posts by user for bar chart
        const postsData = users.slice(0, 5).map((user) => ({
          name: user.username,
          posts: posts.filter((post) => post.userId === user.id).length,
        }));
        setPostsByUser(postsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const completionRate = ((stats.completedTodos / stats.todos) * 100).toFixed(
    1,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Total Users</CardDescription>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {stats.users}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Active users in the system
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Total Posts</CardDescription>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {stats.posts}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Posts created by users
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Total Tasks</CardDescription>
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {stats.todos}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {stats.completedTodos} completed tasks
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Completion Rate</CardDescription>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {completionRate}%
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <IconTrendingUp className="size-3" />
                Good
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Task completion percentage
          </CardFooter>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Overview</CardTitle>
            <CardDescription>Posts and todos by user</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="Posts"
                />
                <Line
                  type="monotone"
                  dataKey="todos"
                  stroke="#00C49F"
                  strokeWidth={2}
                  name="Todos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Posts by User Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Distribution</CardTitle>
            <CardDescription>Top 5 users by posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postsByUser}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="posts" fill="#8884D8" name="Posts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
