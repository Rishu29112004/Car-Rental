"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { useModal } from "@/context/modal-context";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  updateUserPicture,
  UpdateUserPictureSchema,
} from "./validation/update-userProfile.schema";

import { profileServices } from "@/components/services/authProfile.service";

interface UserProfile {
  _id: string;
  name?: string;
  userName?: string;
  email: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
}

/* ✅ onSuccess ADD KIYA (Delete nahi kiya kuch) */
const UserProfileEdit = ({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => void;
}) => {
  const { closeSheet } = useModal();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<UpdateUserPictureSchema>({
    resolver: zodResolver(updateUserPicture),
    defaultValues: {
      image: undefined,
      name: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  // ✅ PREFILL USER DATA
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const user: UserProfile = await profileServices.getProfile(userId);

        setPreview(user.imageUrl || null);

        form.reset({
          image: undefined,
          name: user.name || user.userName || "", // ✅ BOTH SUPPORT
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
        });
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchUser();
  }, [userId, form]);

const onSubmit = async (data: UpdateUserPictureSchema) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("phone", data.phone || "");
    formData.append("bio", data.bio || "");
    if (data.image) formData.append("imageUrl", data.image); // matches multer key

    await profileServices.updateProfile(userId, formData);

    toast.success("Profile updated successfully");
    onSuccess?.();
    closeSheet();
  } catch (error) {
    toast.error("Failed to update profile");
    console.error(error);
  }
};


  return (
    <div className="h-[100dvh] overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 border p-5 rounded-xl bg-slate-100 w-full max-w-lg mx-auto"
        >
          {/* IMAGE */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border">
                      <Image
                        src={preview || "/user_profile.png"}
                        alt="profile"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);

                        if (file) {
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* USER NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" readOnly/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PHONE */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BIO */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUBMIT */}
          <Button className="w-full cursor-pointer">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileEdit;
