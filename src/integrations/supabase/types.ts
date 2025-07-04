export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          created_at: string
          id: string
          imagen_url: string | null
          nombre: string
        }
        Insert: {
          created_at?: string
          id?: string
          imagen_url?: string | null
          nombre: string
        }
        Update: {
          created_at?: string
          id?: string
          imagen_url?: string | null
          nombre?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          actualizado_en: string | null
          creado_en: string | null
          email: string | null
          es_empresa: boolean
          id: string
          nombre: string
          razon_social: string | null
          ruc: string | null
          telefono: string | null
        }
        Insert: {
          actualizado_en?: string | null
          creado_en?: string | null
          email?: string | null
          es_empresa?: boolean
          id?: string
          nombre: string
          razon_social?: string | null
          ruc?: string | null
          telefono?: string | null
        }
        Update: {
          actualizado_en?: string | null
          creado_en?: string | null
          email?: string | null
          es_empresa?: boolean
          id?: string
          nombre?: string
          razon_social?: string | null
          ruc?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      cotizacion_productos: {
        Row: {
          cantidad: number
          cotizacion_id: string
          id: string
          nombre_producto: string
          observaciones: string | null
          precio_total: number
          precio_unitario: number
          producto_id: string
        }
        Insert: {
          cantidad?: number
          cotizacion_id: string
          id?: string
          nombre_producto: string
          observaciones?: string | null
          precio_total?: number
          precio_unitario?: number
          producto_id: string
        }
        Update: {
          cantidad?: number
          cotizacion_id?: string
          id?: string
          nombre_producto?: string
          observaciones?: string | null
          precio_total?: number
          precio_unitario?: number
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotizacion_productos_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: {
          cliente_id: string
          creado_en: string
          creado_por: string | null
          enviado_en: string | null
          estado: Database["public"]["Enums"]["estado_cotizacion"]
          id: string
          nombre_cliente: string | null
          observaciones: string | null
          razon_social: string | null
          ruc: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id: string
          creado_en?: string
          creado_por?: string | null
          enviado_en?: string | null
          estado?: Database["public"]["Enums"]["estado_cotizacion"]
          id?: string
          nombre_cliente?: string | null
          observaciones?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string
          creado_en?: string
          creado_por?: string | null
          enviado_en?: string | null
          estado?: Database["public"]["Enums"]["estado_cotizacion"]
          id?: string
          nombre_cliente?: string | null
          observaciones?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones_proveedor: {
        Row: {
          enviado_en: string
          id: string
          observaciones: string | null
          pedido_id: string
          proveedor_id: string
          respondido_en: string | null
          status: string
        }
        Insert: {
          enviado_en?: string
          id?: string
          observaciones?: string | null
          pedido_id: string
          proveedor_id: string
          respondido_en?: string | null
          status?: string
        }
        Update: {
          enviado_en?: string
          id?: string
          observaciones?: string | null
          pedido_id?: string
          proveedor_id?: string
          respondido_en?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_proveedor_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_proveedor_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones_ventas: {
        Row: {
          cantidad: number
          cliente_id: string | null
          convertido_pedido_id: string | null
          email_cliente: string | null
          enviado_en: string | null
          enviado_por: string | null
          estado: string
          id: string
          margen_est_mensaje: number | null
          mensaje: string | null
          nombre_cliente: string | null
          precio_tipo: string
          precio_total: number
          precio_unitario: number
          producto_codigo: string | null
          producto_id: string
          producto_nombre: string
          respondido_en: string | null
          telefono_cliente: string | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number
          cliente_id?: string | null
          convertido_pedido_id?: string | null
          email_cliente?: string | null
          enviado_en?: string | null
          enviado_por?: string | null
          estado?: string
          id?: string
          margen_est_mensaje?: number | null
          mensaje?: string | null
          nombre_cliente?: string | null
          precio_tipo: string
          precio_total?: number
          precio_unitario?: number
          producto_codigo?: string | null
          producto_id: string
          producto_nombre: string
          respondido_en?: string | null
          telefono_cliente?: string | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          cliente_id?: string | null
          convertido_pedido_id?: string | null
          email_cliente?: string | null
          enviado_en?: string | null
          enviado_por?: string | null
          estado?: string
          id?: string
          margen_est_mensaje?: number | null
          mensaje?: string | null
          nombre_cliente?: string | null
          precio_tipo?: string
          precio_total?: number
          precio_unitario?: number
          producto_codigo?: string | null
          producto_id?: string
          producto_nombre?: string
          respondido_en?: string | null
          telefono_cliente?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      detalle_cotizacion_proveedor: {
        Row: {
          cotizacion_id: string
          disponible: boolean
          id: string
          precio: number
          producto_id: string
          tiempo_entrega_dias: number | null
        }
        Insert: {
          cotizacion_id: string
          disponible?: boolean
          id?: string
          precio: number
          producto_id: string
          tiempo_entrega_dias?: number | null
        }
        Update: {
          cotizacion_id?: string
          disponible?: boolean
          id?: string
          precio?: number
          producto_id?: string
          tiempo_entrega_dias?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detalle_cotizacion_proveedor_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones_proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_cotizacion_proveedor_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          creado_en: string
          id: string
          leida: boolean
          mensaje: string | null
          tipo: string
          titulo: string
          usuario_id: string
        }
        Insert: {
          creado_en?: string
          id?: string
          leida?: boolean
          mensaje?: string | null
          tipo: string
          titulo: string
          usuario_id: string
        }
        Update: {
          creado_en?: string
          id?: string
          leida?: boolean
          mensaje?: string | null
          tipo?: string
          titulo?: string
          usuario_id?: string
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          cancelado_en: string | null
          cancelado_por: string | null
          cliente_email: string | null
          cliente_id: string | null
          cliente_nombre: string
          cliente_telefono: string | null
          cotizacion_id: string | null
          created_at: string
          estado: string
          id: string
          motivo_cancelacion: string | null
          numero_orden: string | null
          observaciones: string | null
          productos: Json
          total: number
        }
        Insert: {
          cancelado_en?: string | null
          cancelado_por?: string | null
          cliente_email?: string | null
          cliente_id?: string | null
          cliente_nombre: string
          cliente_telefono?: string | null
          cotizacion_id?: string | null
          created_at?: string
          estado?: string
          id?: string
          motivo_cancelacion?: string | null
          numero_orden?: string | null
          observaciones?: string | null
          productos: Json
          total?: number
        }
        Update: {
          cancelado_en?: string | null
          cancelado_por?: string | null
          cliente_email?: string | null
          cliente_id?: string | null
          cliente_nombre?: string
          cliente_telefono?: string | null
          cotizacion_id?: string | null
          created_at?: string
          estado?: string
          id?: string
          motivo_cancelacion?: string | null
          numero_orden?: string | null
          observaciones?: string | null
          productos?: Json
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_proveedor: {
        Row: {
          disponible: boolean
          id: string
          precio: number
          producto_id: string
          proveedor_id: string
          tiempo_entrega_dias: number | null
        }
        Insert: {
          disponible?: boolean
          id?: string
          precio: number
          producto_id: string
          proveedor_id: string
          tiempo_entrega_dias?: number | null
        }
        Update: {
          disponible?: boolean
          id?: string
          precio?: number
          producto_id?: string
          proveedor_id?: string
          tiempo_entrega_dias?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "producto_proveedor_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producto_proveedor_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          cantidad_minima_mayorista: number
          categoria: string
          created_at: string
          descripcion: string | null
          etiquetas: string[] | null
          id: string
          imagen_url: string | null
          marca: string
          nombre: string
          precio_por_mayor: number
          precio_unitario: number
          sku: string
          updated_at: string
        }
        Insert: {
          cantidad_minima_mayorista?: number
          categoria: string
          created_at?: string
          descripcion?: string | null
          etiquetas?: string[] | null
          id?: string
          imagen_url?: string | null
          marca?: string
          nombre: string
          precio_por_mayor?: number
          precio_unitario?: number
          sku: string
          updated_at?: string
        }
        Update: {
          cantidad_minima_mayorista?: number
          categoria?: string
          created_at?: string
          descripcion?: string | null
          etiquetas?: string[] | null
          id?: string
          imagen_url?: string | null
          marca?: string
          nombre?: string
          precio_por_mayor?: number
          precio_unitario?: number
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_fkey"
            columns: ["categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["nombre"]
          },
        ]
      }
      proveedores: {
        Row: {
          contacto: string | null
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          observaciones: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          contacto?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          observaciones?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          contacto?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          observaciones?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          permisos: Json | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          permisos?: Json | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          permisos?: Json | null
        }
        Relationships: []
      }
      templates_mensajes: {
        Row: {
          actualizado_en: string | null
          contenido: string
          creado_en: string | null
          creado_por: string | null
          id: string
          nombre: string
          tipo: string
        }
        Insert: {
          actualizado_en?: string | null
          contenido: string
          creado_en?: string | null
          creado_por?: string | null
          id?: string
          nombre: string
          tipo: string
        }
        Update: {
          actualizado_en?: string | null
          contenido?: string
          creado_en?: string | null
          creado_por?: string | null
          id?: string
          nombre?: string
          tipo?: string
        }
        Relationships: []
      }
      usuario_roles: {
        Row: {
          activo: boolean
          asignado_por: string | null
          created_at: string
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          rol_id: string
          usuario_id: string
        }
        Insert: {
          activo?: boolean
          asignado_por?: string | null
          created_at?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          rol_id: string
          usuario_id: string
        }
        Update: {
          activo?: boolean
          asignado_por?: string | null
          created_at?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          rol_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_roles_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nombre: string
          usuario: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nombre: string
          usuario: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          usuario?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          user_email: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          additional_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          additional_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          additional_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
      }
      exchange_rates: {
        Row: {
          id_tc: number;
          fecha: string;
          tc: number;
        };
        Insert: {
          id_tc?: number;
          fecha: string;
          tc: number;
        };
        Update: {
          id_tc?: number;
          fecha?: string;
          tc?: number;
        };
        Relationships: [];
      }
    }
    Views: {
      pedidos_audit_view: {
        Row: {
          id: string
          user_email: string | null
          action: string
          pedido_id: string
          old_values: Json | null
          new_values: Json | null
          additional_data: Json | null
          created_at: string
          action_description: string
        }
        Insert: {
          id?: string
          user_email?: string | null
          action?: string
          pedido_id?: string
          old_values?: Json | null
          new_values?: Json | null
          additional_data?: Json | null
          created_at?: string
          action_description?: string
        }
        Update: {
          id?: string
          user_email?: string | null
          action?: string
          pedido_id?: string
          old_values?: Json | null
          new_values?: Json | null
          additional_data?: Json | null
          created_at?: string
          action_description?: string
        }
        Relationships: []
      }
    }
    Functions: {
      generar_notificacion_cotizacion_pendiente: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_has_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
      }
      user_has_specific_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
      }
      get_audit_history: {
        Args: { p_table_name: string; p_record_id: string }
        Returns: {
          id: string
          user_email: string | null
          action: string
          old_values: Json | null
          new_values: Json | null
          additional_data: Json | null
          created_at: string
        }[]
      }
      get_user_audit_history: {
        Args: { p_user_id: string; p_limit: number }
        Returns: {
          id: string
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          additional_data: Json | null
          created_at: string
        }[]
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_table_name: string
          p_record_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_additional_data?: Json
          p_user_id?: string
          p_user_email?: string
        }
        Returns: string
      }
      cleanup_old_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      estado_cotizacion:
        | "pendiente"
        | "aceptada"
        | "rechazada"
        | "anulada"
        | "pedido_generado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_cotizacion: [
        "pendiente",
        "aceptada",
        "rechazada",
        "anulada",
        "pedido_generado",
      ],
    },
  },
} as const
