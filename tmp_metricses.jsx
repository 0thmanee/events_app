{/* Enterprise Metrics Section */}
<Animated.View style={[metricsStyle, { marginBottom: 80 }]}>
              
{/* Metrics Header */}
<View style={{ 
  flexDirection: 'row', 
  alignItems: 'center', 
  marginBottom: 32,
  paddingLeft: 4,
}}>
  <View style={{
    width: 3,
    height: 20,
    backgroundColor: '#3b82f6',
    marginRight: 16,
  }} />
  <Text style={{
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }}>
    Platform Metrics
  </Text>
</View>

{/* Featured Metric */}
<View style={{
  backgroundColor: '#0a0a0a',
  borderWidth: 1,
  borderColor: '#1f2937',
  padding: 32,
  marginBottom: 24,
  position: 'relative',
}}>
  {/* Accent border */}
  <View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: currentMetricData.accent,
  }} />
  
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
    <View style={{
      width: 48,
      height: 48,
      backgroundColor: '#111827',
      borderWidth: 1,
      borderColor: '#374151',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    }}>
      <currentMetricData.icon 
        color={currentMetricData.accent} 
        size={24} 
        strokeWidth={1.5} 
      />
    </View>
    
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 36,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: -1,
        marginBottom: 4,
      }}>
        {currentMetricData.value}
      </Text>
      
      <Text style={{
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
      }}>
        {currentMetricData.label}
      </Text>
    </View>
  </View>
  
  <Text style={{
    fontSize: 16,
    color: '#9ca3af',
    lineHeight: 24,
  }}>
    {currentMetricData.description}
  </Text>
</View>

{/* Metric Indicators */}
<View style={{ 
  flexDirection: 'row', 
  justifyContent: 'center',
  gap: 12,
}}>
  {metrics.map((metric, index) => (
    <View
      key={index}
      style={{
        width: index === currentMetric ? 24 : 8,
        height: 2,
        backgroundColor: index === currentMetric ? metric.accent : '#374151',
      }}
    />
  ))}
</View>
</Animated.View>