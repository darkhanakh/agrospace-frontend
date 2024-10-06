"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/utils/supabase/client";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, bio")
          .eq("id", user.id)
          .single();

        if (data) {
          setFullName(data.full_name || "");
          setBio(data.bio || "");
        }
      }
      setLoading(false);
    }
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      bio: bio,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль. Попробуйте снова.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Успех",
        description: "Ваш профиль обновлен.",
      });
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{fullName || user.email}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="account">Аккаунт</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProfile();
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="fullName">Полное имя</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Введите ваше полное имя"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Биография</Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Расскажите о себе"
                  />
                </div>
                <Button type="submit">Обновить профиль</Button>
              </form>
            </TabsContent>
            <TabsContent value="account">
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ""} disabled />
                </div>
                <div>
                  <Label>Последний вход</Label>
                  <Input
                    value={new Date(
                      user.last_sign_in_at || ""
                    ).toLocaleString()}
                    disabled
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleSignOut}>
            Выйти
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
