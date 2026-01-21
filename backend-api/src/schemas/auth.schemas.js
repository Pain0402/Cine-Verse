const { z } = require("zod");

const registerSchema = z.object({
  username: z
    .string({
      required_error: "Tên người dùng là bắt buộc.",
    })
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự."),

  email: z
    .string({
      required_error: "Email là bắt buộc.",
    })
    .email("Email không hợp lệ."),

  password: z
    .string({
      required_error: "Mật khẩu là bắt buộc.",
    })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email là bắt buộc.",
    })
    .email("Email không hợp lệ."),

  password: z.string({
    required_error: "Mật khẩu là bắt buộc.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
