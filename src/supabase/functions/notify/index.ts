Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, data } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const whatsappNumber = "917819086039";
    const adminEmail = "arshilfatima517@gmail.com";

    let message = "";
    let subject = "";

    if (type === "consultation") {
      const rooms = data.rooms || [];
      const roomSummary = rooms.length > 0
        ? rooms.map((r: any) => `  - ${r.roomType} (${r.roomSize}), Style: ${r.style}, Budget: ${r.budget}`).join("\n")
        : "  - Single room consultation";

      message = `*New Consultation Booking - Blue Mist Interiors*\n\n` +
        `Name: ${data.fullName}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone}\n` +
        `Currency: ${data.currency}\n` +
        `Multi-room: ${data.isMultiRoom ? "Yes" : "No"}\n` +
        `Delivery Area: ${data.deliveryArea || "N/A"}\n` +
        `Delivery Charges: ${data.deliveryCharges || 0} ${data.currency}\n` +
        `Deposit: ${data.depositOption === "half" ? "Half deposit" : "Full payment"}\n` +
        `Preferred Date: ${data.preferredDate || "N/A"}\n\n` +
        `Rooms:\n${roomSummary}\n\n` +
        `Message: ${data.message || "N/A"}`;
      subject = `New Consultation: ${data.fullName}`;
    } else if (type === "furniture_order") {
      message = `*New Furniture Order - Blue Mist Interiors*\n\n` +
        `Name: ${data.fullName}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone}\n` +
        `Item: ${data.itemName}\n` +
        `Material: ${data.material}\n` +
        `Material Price: ${data.materialPrice} ${data.currency}\n` +
        `Quantity: ${data.quantity}\n` +
        `Delivery Area: ${data.deliveryArea || "N/A"}\n` +
        `Delivery Charges: ${data.deliveryCharges || 0} ${data.currency}\n` +
        `Total: ${data.totalPrice} ${data.currency}\n` +
        `Deposit: ${data.depositOption === "half" ? "Half deposit" : "Full payment"}`;
      subject = `New Furniture Order: ${data.fullName}`;
    } else if (type === "feedback") {
      message = `*New Feedback - Blue Mist Interiors*\n\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Rating: ${data.rating}/5\n` +
        `Project: ${data.projectType || "N/A"}\n` +
        `Message: ${data.message}`;
      subject = `New Feedback: ${data.name} (${data.rating}★)`;
    } else if (type === "consultation_action") {
      message = `*Consultation ${data.action.toUpperCase()} - Blue Mist*\n\n` +
        `Client: ${data.clientName}\n` +
        `Phone: ${data.clientPhone}\n` +
        `Email: ${data.clientEmail}\n` +
        `Action: ${data.action}`;
      subject = `Consultation ${data.action}: ${data.clientName}`;
    } else {
      return new Response(
        JSON.stringify({ error: "Unknown notification type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const waApiUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    const notifications: { channel: string; status: string; detail: string }[] = [];

    // Send WhatsApp via CallMeBot or Twilio if configured, otherwise prepare the link
    const whatsappApiKey = Deno.env.get("WHATSAPP_API_KEY");
    if (whatsappApiKey) {
      try {
        const waRes = await fetch(
          `https://api.callmebot.com/whatsapp.php?phone=${whatsappNumber}&text=${encodeURIComponent(message)}&apikey=${whatsappApiKey}`,
        );
        notifications.push({
          channel: "whatsapp",
          status: waRes.ok ? "sent" : "failed",
          detail: waRes.ok ? "WhatsApp message delivered" : `HTTP ${waRes.status}`,
        });
      } catch (e) {
        notifications.push({ channel: "whatsapp", status: "error", detail: e.message });
      }
    } else {
      notifications.push({
        channel: "whatsapp",
        status: "pending",
        detail: "Set WHATSAPP_API_KEY secret to enable direct WhatsApp delivery",
      });
    }

    // Send email notification via Resend if configured
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Blue Mist <notifications@blue-mist.design>",
            to: [adminEmail],
            subject: subject,
            text: message,
          }),
        });
        notifications.push({
          channel: "email",
          status: emailRes.ok ? "sent" : "failed",
          detail: emailRes.ok ? "Email delivered to admin" : `HTTP ${emailRes.status}`,
        });
      } catch (e) {
        notifications.push({ channel: "email", status: "error", detail: e.message });
      }
    } else {
      notifications.push({
        channel: "email",
        status: "pending",
        detail: "Set RESEND_API_KEY secret to enable email delivery",
      });
    }

    return new Response(
      JSON.stringify({ success: true, notifications, whatsappLink: waApiUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
// trigger redeploy Tue Sep 22 17:16:08 UTC 2026
