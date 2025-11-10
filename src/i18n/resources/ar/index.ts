import navbar from "./layout/navbarDashboard";
import auth from "./auth/auth";
import utils from "./utils";
import sidebar from "./layout/sidebarDashboard";
import dashboard from "./dashboard/dashboard";
import { send } from "./dashboard/send";
import { recipient } from "./dashboard/recipient";
import { group } from "./dashboard/group";
import template from "./dashboard/template";
import log from "./dashboard/log";
import user from "./dashboard/user";
import home from "./home/home";
import layout from "./layout/layout";

export default {
  layout,
  utils,
  navbar,
  sidebar,
  auth,
  dashboard,
  send,
  recipient,
  group,
  template,
  log,
  user,
  home,
} as const;
